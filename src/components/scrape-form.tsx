"use client"
import { useEffect, useState } from 'react';

export default function ScrapeDataComponent() {
  const [scrapedData, setScrapedData] = useState(null);

  useEffect(() => {
    // Fetch data from the API route
    async function fetchData() {
      try {
        const response = await fetch('/api/scrape/playwright?url=https://example.com');  // Provide the URL to scrape
        const result = await response.json();
        
        if (response.ok) {
          setScrapedData(result.data);  // Set the scraped data
        } else {
          console.error('Failed to fetch data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);  // Empty dependency array means this will run only once when the component mounts

  return (
    <div>
      <h1>Scraped Data</h1>
      {scrapedData ? (
        <div>
          <p>{scrapedData}</p>  {/* Display the scraped data */}
        </div>
      ) : (
        <p>Loading...</p> 
      )}
    </div>
  );
}
