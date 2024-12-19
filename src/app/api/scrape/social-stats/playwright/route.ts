import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export const GET = async (request: Request) => {
   try{
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.viberate.com/artist/beyonce/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const content = await page.content();
    const socialStats = await page.evaluate(() => {
      // gets all the li elements in the class .header-stats   
        const socialStats = document.querySelectorAll('.header-socials li');
        return Array.from(socialStats).map(li => li.textContent).join(', ');
    });
    // get the second li element

    // Optionally, you can grab the result after submitting
    console.log('socialStats   ======= ', socialStats); 
    //console.log(content);
    await browser.close();
    return NextResponse.json({ content });
   } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape YouTube page' }, { status: 500 });
   }
}
