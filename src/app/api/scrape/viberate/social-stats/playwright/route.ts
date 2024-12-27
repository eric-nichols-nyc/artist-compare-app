import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

async function delay() {
  // Random delay between .45-1.25 minutes
  const delayTime = Math.random() * 45000 + 30000;
  await new Promise(resolve => setTimeout(resolve, delayTime));
}

export const GET = async () => {
  let browser = null;

   try{
    await delay();

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
    await page.goto('https://www.viberate.com/artist/ariana-grande//', { waitUntil: 'networkidle' });
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
    // get the second li element

    // Optionally, you can grab the result after submitting
    console.log('socialStats   ======= ', socialStats); 
    //console.log(content);
    await browser.close();
    return NextResponse.json({ socialStats });
   } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape YouTube page' }, { status: 500 });
   }
}
