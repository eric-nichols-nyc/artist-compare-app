import { config } from 'dotenv';
import { ArtistIngestionService } from './artist-ingestion-service.js';
import { setTimeout } from 'timers/promises';

// Load environment variables
config();

const TOP_ARTISTS = [
    "Taylor Swift",
    "Drake",
    "Bad Bunny",
    "The Weeknd",
    "Travis Scott",
    "SZA",
    "Morgan Wallen",
    "21 Savage",
    "Peso Pluma",
    "Ed Sheeran"
];

async function ingestTopArtists() {
    const ingestionService = new ArtistIngestionService();
    const results: Record<string, { success: boolean; error?: string }> = {};

    console.log('Starting artist ingestion process...');

    for (const artist of TOP_ARTISTS) {
        try {
            console.log(`\nProcessing ${artist}...`);
            
            // Ingest the artist
            const result = await ingestionService.ingestArtist(artist);
            console.log(`✅ Successfully added ${artist}`);
            results[artist] = { success: true };

            // Wait 2 seconds between artists to respect API rate limits
            await setTimeout(2000);

        } catch (error) {
            console.error(`❌ Failed to add ${artist}:`, error);
            results[artist] = { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            };
            
            // Wait 5 seconds after an error before continuing
            await setTimeout(5000);
        }
    }

    // Print summary
    console.log('\n=== Ingestion Summary ===');
    Object.entries(results).forEach(([artist, result]) => {
        if (result.success) {
            console.log(`✅ ${artist}: Success`);
        } else {
            console.log(`❌ ${artist}: Failed - ${result.error}`);
        }
    });

    const successCount = Object.values(results).filter(r => r.success).length;
    console.log(`\nSuccessfully added ${successCount} out of ${TOP_ARTISTS.length} artists`);
}

// Run the ingestion
ingestTopArtists().catch(console.error);