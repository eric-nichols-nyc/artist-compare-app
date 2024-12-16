const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');

config();

const supabase = createClient(
    "https://anhhzyknbqmtzsnpioav.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuaGh6eWtuYnFtdHpzbnBpb2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMzMwMzQsImV4cCI6MjA0OTcwOTAzNH0.NBojnToC3RC5xGCpzqjKWpH5bSMapDF68E659UsOtIA"
);

async function clearDatabase() {
    console.log('Starting database cleanup...');

    try {
        // Clear tables in order (children first, then parents)
        const tables = [
            'artist_videos',
            'artist_analytics',
            'artist_geography',
            'artist_similarities',
            'artist_comparisons',
            'artist_top_tracks',
            'artists'  // This must be last as other tables reference it
        ];

        for (const table of tables) {
            console.log(`Clearing ${table}...`);
            const { error } = await supabase
                .from(table)
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

            if (error) {
                console.error(`Error clearing ${table}:`, error);
            } else {
                console.log(`✅ Successfully cleared ${table}`);
            }
        }

        console.log('Database cleanup completed successfully!');
    } catch (error) {
        console.error('Failed to clear database:', error);
    }
}

// Run the cleanup
clearDatabase().catch(console.error);