import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

async function delay() {
  // Random delay between 1.5-2.5 minutes
  const delayTime = Math.random() * 90000 + 60000;
  await new Promise(resolve => setTimeout(resolve, delayTime));
}

export const GET = async () => {
    let browser = null;
    try {
      // Add natural delay before starting
      // await delay();

      // Launch browser with stealth options
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
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        deviceScaleFactor: 1,
        isMobile: false,
      });

      const page = await context.newPage();
     await page.goto('https://open.spotify.com/artist/6jJ0s89eD6GaHleKKya26X', { waitUntil: 'networkidle', timeout: 30000  });
    await page.waitForTimeout(3000);
  
    const popularTracks = await page.evaluate(() => {
      const tracksSection = document.querySelector('[data-testid="track-list"]');
      console.log('tracksSection', tracksSection);
      if (!tracksSection) return [];
      
      const tracks = tracksSection.querySelectorAll('[data-testid="tracklist-row"]');
      return Array.from(tracks).map(track => ({
        title: track.querySelector('[data-testid="internal-track-link"]')?.textContent,
        plays: track.querySelector('[aria-colindex="3"]')?.textContent
      }));
    });

    console.log('Popular tracks:', popularTracks);
    await browser.close();
    return NextResponse.json({ popularTracks });
   } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape YouTube page' }, { status: 500 });
   }
}
