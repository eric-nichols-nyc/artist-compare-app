import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

// Initialize environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing required environment variables');
}

export class OpenAIService {
    private openai: OpenAI;
    public supabase;

    constructor() {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });

        this.supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
    }

    /**
     * Generate an embedding for a given text using OpenAI's API
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: text,
                encoding_format: "float",
            });

            return response.data[0].embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    /**
     * Generate multiple embeddings in batch
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            const response = await this.openai.embeddings.create({
                model: "text-embedding-3-small",
                input: texts,
                encoding_format: "float",
            });

            return response.data.map(item => item.embedding);
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw new Error('Failed to generate embeddings');
        }
    }

    /**
     * Generate a comparison between two artists using GPT-4
     */
    async generateArtistComparison(
        artist1: string,
        artist2: string
    ): Promise<{ comparisonText: string; embedding: number[] }> {
        try {
            // Generate the comparison text
            const comparison = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: `Compare the musical artists ${artist1} and ${artist2} in terms of:
                    Format each matching attribute side by side, with shared elements clearly marked as "BOTH:" followed by the common trait. If traits differ, list them separately. for example:

                    MUSICAL FOUNDATIONS
                    First Instrument:
                    BOTH: [if same] or
                    [ARTIST 1]: [instrument]
                    [ARTIST 2]: [instrument]
                    
                    Musical Training:
                    SHARED: [if same] or
                    [ARTIST 1]: [training]
                    [ARTIST 2]: [training]
                    
                    Genre Origins:
                    BOTH: [if same] or
                    [ARTIST 1]: [genre]
                    [ARTIST 2]: [genre]
                    
                    CAREER ELEMENTS
                    Age at First Hit:
                    BOTH: [if same] or
                    [ARTIST 1]: [age]
                    [ARTIST 2]: [age]
                    
                    Record Labels:
                    BOTH: [if worked with same labels]
                    [ARTIST 1] unique: [labels]
                    [ARTIST 2] unique: [labels]
                    
                    Grammy Categories Won:
                    BOTH: [if similar]
                    [ARTIST 1] unique: [categories]
                    [ARTIST 2] unique: [categories]
                    
                    CREATIVE APPROACH
                    Writing Process:
                    BOTH: [if same]
                    [ARTIST 1] unique: [process]
                    [ARTIST 2] unique: [process]
                    
                    Producers Worked With:
                    BOTH: [common producers]
                    [ARTIST 1] unique: [producers]
                    [ARTIST 2] unique: [producers]
                    
                    BUSINESS VENTURES
                    Industry Investments:
                    BOTH: [similar investments]
                    [ARTIST 1] unique: [investments]
                    [ARTIST 2] unique: [investments]
                    
                    Brand Partnerships:
                    BOTH: [similar partnerships]
                    [ARTIST 1] unique: [partnerships]
                    [ARTIST 2] unique: [partnerships]
                    
                    PERSONAL ELEMENTS
                    Charitable Causes:
                    BOTH: [similar causes]
                    [ARTIST 1] unique: [causes]
                    [ARTIST 2] unique: [causes]

                    Duets:
                    BOTH: [if similar artists]
                    [ARTIST 1] unique: [education]
                    [ARTIST 2] unique: [education]

                    After the comparison, list the 5-10 SURPRISING and UNEXPECTED connections between [artist 1] and [artist 2]. Avoid obvious surface-level comparisons. Dig deep for fascinating connections that most people wouldn't notice. Result should be concise ie: Both LGBT Rights activists from the US, Both have collaborated with the legendary Elton John

                    Focus on specific, verifiable details rather than general statements. Include dates and examples where relevant.
                    Similarities should begin with both:
                                        
                    
                    Begin your analysis with [ARTIST 1] and [ARTIST 2].
.`
                }],
                temperature: 0.7,
                max_tokens: 1000,
            });

            const comparisonText = comparison.choices[0].message.content;
            if (!comparisonText) {
                throw new Error('No comparison text generated');
            }

            // Generate embedding for the comparison
            const embedding = await this.generateEmbedding(comparisonText);

            return {
                comparisonText,
                embedding
            };
        } catch (error) {
            console.error('Error generating artist comparison:', error);
            throw new Error('Failed to generate artist comparison');
        }
    }

    /**
     * Store a comparison in Supabase with its embedding
     */
    async storeComparison(
        artist1Id: string,
        artist2Id: string,
        comparisonText: string,
        embedding: number[],
        similarityScore?: number
    ): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('artist_comparisons')
                .insert({
                    artist1_id: artist1Id,
                    artist2_id: artist2Id,
                    comparison_text: comparisonText,
                    embedding,
                    similarity_score: similarityScore,
                    source: 'openai',
                    created_at: new Date().toISOString()
                });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error storing comparison:', error);
            throw new Error('Failed to store comparison in database');
        }
    }

    /**
     * Find similar comparisons using vector similarity search
     */
    async findSimilarComparisons(
        artist1: string,
        artist2: string,
        limit: number = 5,
        threshold: number = 0.78
    ): Promise<Array<{
        artist1_id: string;
        artist2_id: string;
        comparison_text: string;
        similarity: number;
    }>> {
        try {
            // Generate embedding for the query
            const queryText = `${artist1} ${artist2}`;
            const queryEmbedding = await this.generateEmbedding(queryText);

            // Search for similar comparisons using vector similarity
            const { data, error } = await this.supabase
                .rpc('match_artist_comparisons', {
                    query_embedding: queryEmbedding,
                    match_threshold: threshold,
                    match_count: limit
                });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error finding similar comparisons:', error);
            throw new Error('Failed to find similar comparisons');
        }
    }

    /**
     * Get or generate a comparison between two artists
     */
    async getOrGenerateComparison(
        artist1Id: string,
        artist2Id: string,
        artist1Name: string,
        artist2Name: string
    ): Promise<{
        comparisonText: string;
        source: 'cache' | 'new';
    }> {
        try {
            // First, check for existing comparison
            const { data: existingComparison, error } = await this.supabase
                .from('artist_comparisons')
                .select('comparison_text')
                .match({ artist1_id: artist1Id, artist2_id: artist2Id })
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                throw error;
            }

            if (existingComparison) {
                return {
                    comparisonText: existingComparison.comparison_text,
                    source: 'cache'
                };
            }

            // Generate new comparison if not found
            const { comparisonText, embedding } = await this.generateArtistComparison(
                artist1Name,
                artist2Name
            );

            // Store the new comparison
            await this.storeComparison(artist1Id, artist2Id, comparisonText, embedding);

            return {
                comparisonText,
                source: 'new'
            };
        } catch (error) {
            console.error('Error in getOrGenerateComparison:', error);
            throw new Error('Failed to get or generate comparison');
        }
    }
}