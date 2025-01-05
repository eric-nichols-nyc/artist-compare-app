import { unstable_cache, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { Page } from 'playwright';
import { YoutubeVideoInfo } from '@/validations/artist-schema';

async function delay() {
  // Random delay between .45-1.25 minutes
  const delayTime = Math.random() * 5000 + 2000;
  await new Promise(resolve => setTimeout(resolve, delayTime));
}

// Helper function to parse follower counts
function parseFollowerCount(count: string | null | undefined): number | undefined {
  if (!count) return undefined;
  
  // Remove any non-numeric characters except K, M, B
  const normalized = count.replace(/[^0-9KMB.]/gi, '');
  
  // Convert to number
  let multiplier = 1;
  if (normalized.endsWith('K')) multiplier = 1000;
  if (normalized.endsWith('M')) multiplier = 1000000;
  if (normalized.endsWith('B')) multiplier = 1000000000;
  
  const number = parseFloat(normalized.replace(/[KMB]/gi, ''));
  return number * multiplier;
}

// Add cache checking flag to the response type
interface ViberateResponse {
  socialStats: Record<string, number | undefined>;
  topSongs: any[];
  topVideos: Partial<YoutubeVideoInfo>[];
  monthlyListeners: number | null;
  fromCache?: boolean;
  fetchedAt?: string;
}

// Add custom error class
class ScrapingError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'ScrapingError';
  }
}

// Wrap the scraping logic in a cached function
const getViberateData = (artistName: string) => unstable_cache(
  async (): Promise<ViberateResponse> => {
    let browser = null;

    try {
      await delay();
      
      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--lang=en-US,en'
        ]
      });

      console.log('Starting fresh Viberate scrape for:', artistName);
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        deviceScaleFactor: 1,
        isMobile: false,
      });
      const page = await context.newPage();
      const response = await page.goto(`https://www.viberate.com/artist/${artistName}`, { waitUntil: 'networkidle' });
      
      // Check if page loaded successfully
      if (!response?.ok()) {
        throw new ScrapingError(`Failed to load artist page: ${response?.statusText()}`, 404);
      }

      await page.waitForTimeout(3000);
      const socialStats = await page.evaluate(() => {
        // gets all the li elements in the class .header-stats   
          const socialStats = document.querySelectorAll('.header-socials li');
          return Array.from(socialStats).map(li => ({
            // select the fourth class of the li element
            platform: li.querySelector('div')?.className.split(' ')[3],
            followers: li.querySelector('strong')?.textContent
          }));
      });

      // Parse social stats into structured data
      const parsedStats: Record<string, number | undefined> = {
        facebook: undefined,
        instagram: undefined,
        youtube: undefined,
        spotify: undefined,
        tiktok: undefined,
        soundcloud: undefined
      };

      socialStats.forEach(stat => {
        if (!stat.platform || !stat.followers) return;
        
        // Map Viberate's class names to our platform names
        const platformMap: Record<string, keyof typeof parsedStats> = {
          'facebook': 'facebook',
          'instagram': 'instagram',
          'youtube': 'youtube',
          'spotify': 'spotify',
          'tiktok': 'tiktok',
          'soundcloud': 'soundcloud'
        };

        const platform = platformMap[stat.platform];
        if (platform) {
          parsedStats[platform] = parseFollowerCount(stat.followers);
        }
      });

      const monthlyListeners = await getMonthlyListeners(page);

      // click View Top Songs
      await page.click('.pro-section-channel-top-tracks a');
      // wait for .chart-module.spotify
      await page.waitForSelector('.chart-module.spotify');

      // consol loge the content of the page

      const topSongs = await page.evaluate(() => {
        // Define parseCompactNumber inside the evaluate context
        function parseCompactNumber(value: string | null | undefined): number | undefined {
          if (!value) return undefined;
          const normalized = value.trim().toLowerCase();
          
          if (normalized.endsWith('k')) {
            return parseFloat(normalized.replace('k', '')) * 1000;
          }
          if (normalized.endsWith('m')) {
            return parseFloat(normalized.replace('m', '')) * 1000000;
          }
          if (normalized.endsWith('b')) {
            return parseFloat(normalized.replace('b', '')) * 1000000000;
          }
          
          return parseFloat(normalized);
        }

        return Array.from(document.querySelectorAll('.chart-module.spotify tbody tr')).map(row => ({
          title: row?.querySelector('h3 a')?.textContent ?? 'Title not found',
          imageUrl: row?.querySelector('figure')?.style?.backgroundImage
            ?.replace('url("', '')
            .replace('")', ''),
          monthlyStreams: parseCompactNumber(row.querySelectorAll('.stats strong')[0]?.textContent),
          totalStreams: parseCompactNumber(row.querySelectorAll('.stats strong')[1]?.textContent),
          spotifyUrl: row?.querySelector('h3 a')?.getAttribute('href') ?? 'url not found',
          spotifyTrackId: row?.querySelector('h3 a')?.getAttribute('href')?.split('/')?.[4]
        }));
      });

      // scroll 300px
      await page.evaluate(() => {
        window.scrollBy(0, 1000);
      }); 

      await page.waitForSelector('.chart-module.youtube');

      const topVideos = await page.evaluate(() => {

        function parseCompactNumber(value: string | null | undefined): number | undefined {
          if (!value) return undefined;
          const normalized = value.trim().toLowerCase();
          
          if (normalized.endsWith('k')) {
            return parseFloat(normalized.replace('k', '')) * 1000;
          }
          if (normalized.endsWith('m')) {
            return parseFloat(normalized.replace('m', '')) * 1000000;
          }
          if (normalized.endsWith('b')) {
            return parseFloat(normalized.replace('b', '')) * 1000000000;
          }
          
          return parseFloat(normalized);
        }
        // Define parseCompactNumber inside this evaluate context too

        return Array.from(document.querySelectorAll('.chart-module.youtube tbody tr')).map(row => ({
          title: row?.querySelector('h3 a')?.textContent || '',
          videoId: row?.querySelector('h3 a')?.getAttribute('href')?.split('/')?.pop() || '',
          thumbnail: row?.querySelector('figure')?.style?.backgroundImage
            ?.replace('url("', '')
            .replace('")', '') || null,
          monthlyStreams: parseCompactNumber(row.querySelectorAll('.stats strong')[0]?.textContent),
          totalStreams: parseCompactNumber(row.querySelectorAll('.stats strong')[1]?.textContent),
          platform: 'youtube',
          viewCount: 0
        }));
      });


      // Optionally, you can grab the result after submitting
      //console.log(content);
      await browser.close();

      // Store the scraped data
      useScrapedDataStore.getState().setViberateVideos(topVideos)
      useScrapedDataStore.getState().setViberateTracks(topSongs)
      useScrapedDataStore.getState().setSocialStats(parsedStats)
      useScrapedDataStore.getState().setSpotifyMonthlyListeners(monthlyListeners || 0)

      return { 
        socialStats: parsedStats, 
        topSongs, 
        topVideos,
        monthlyListeners,
        fromCache: false,
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Scraping error:', error);
      if (error instanceof ScrapingError) {
        throw error;
      }
      throw new ScrapingError('Failed to scrape data');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
  [`viberate-data-${artistName}`],
  {
    revalidate: 86400,
    tags: [`viberate-data-${artistName}`],
  }
);

const getMonthlyListeners = async (page: Page): Promise<number | null> => {
  function parseCompactNumber(value: string | null | undefined): number | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    
    if (normalized.endsWith('k')) {
      return parseFloat(normalized.replace('k', '')) * 1000;
    }
    if (normalized.endsWith('m')) {
      return parseFloat(normalized.replace('m', '')) * 1000000;
    }
    if (normalized.endsWith('b')) {
      return parseFloat(normalized.replace('b', '')) * 1000000000;
    }
    
    return parseFloat(normalized);
  }
  const monthlyListeners = await page.$eval(
    '.analytics-module-content .stats strong', 
    (element:any) => element.textContent || null
  );
  return parseCompactNumber(monthlyListeners) || null;
};

export const GET = async (req: Request) => {
  try {
    const {searchParams} = new URL(req.url);
    const artistName = searchParams.get('artistName');
    const clearCache = searchParams.get('clearCache') === 'true';

    if(!artistName) {
      return NextResponse.json(
        { error: 'Artist name is required' }, 
        { status: 400 }
      );
    }

    if (clearCache) {
      console.log('Clearing cache for:', artistName);
      revalidateTag(`viberate-data-${artistName}`);
    }

    // Add cache debugging
    console.log('Cache key:', `viberate-data-${artistName}`);
    
    const startTime = performance.now();
    const data = await getViberateData(artistName)();
    const endTime = performance.now();

    // More accurate cache detection (responses under 100ms are likely cached)
    const isCached = endTime - startTime < 100;
    
    console.log(`Response time: ${endTime - startTime}ms`);
    console.log(`Data for ${artistName} - ${isCached ? 'from cache' : 'freshly scraped'}`);
    
    return NextResponse.json({
      ...data,
      fromCache: isCached,
      fetchedAt: isCached ? data.fetchedAt : new Date().toISOString(),
      responseTime: `${Math.round(endTime - startTime)}ms`
    });

  } catch (error) {
    console.error('Route error:', error);
    
    if (error instanceof ScrapingError) {
      return NextResponse.json(
        { error: error.message }, 
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
};
