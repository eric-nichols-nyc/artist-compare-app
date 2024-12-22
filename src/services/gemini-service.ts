import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('Missing GOOGLE_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

type BioType = 'full' | 'summary';

interface ArtistBioInfo {
    name: string;
    genres?: string[];
    country?: string | null;
    activeYears?: {
        begin: string | null;
        end: string | null;
    };
    gender?: string | null;
}

export class GeminiService {
    private model;

    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateArtistBio(artistInfo: ArtistBioInfo, type: BioType = 'full'): Promise<string> {
        const startTime = performance.now();
        try {
            const prompt = type === 'summary' 
                ? this.createSummaryBioPrompt(artistInfo)
                : this.createFullBioPrompt(artistInfo);

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const bio = response.text();
            const endTime = performance.now();
            console.log(`Time taken to generate artist bio: ${endTime - startTime} milliseconds`);
            return this.cleanBioText(bio);
        } catch (error) {
            console.error('Error generating artist bio:', error);
            throw new Error('Failed to generate artist biography');
        }
    }

    private createSummaryBioPrompt(artistInfo: ArtistBioInfo): string {
        const { name, genres, country, activeYears } = artistInfo;
        
        return `Write a concise one-paragraph summary biography for the music artist ${name}. 
        ${genres?.length ? `They are known for performing ${genres.join(', ')} music.` : ''}
        ${country ? `They are from ${country}.` : ''}
        ${activeYears?.begin ? `They began their career in ${activeYears.begin}.` : ''}

        Focus on their most significant achievements and musical style.
        Keep it between 50-75 words.
        Be factual and avoid speculation.
        The tone should be professional and informative.`;
    }

    private createFullBioPrompt(artistInfo: ArtistBioInfo): string {
        const { name, genres, country, activeYears, gender } = artistInfo;
        
        return `Write a professional, engaging biography for the music artist ${name}. 
        ${genres?.length ? `They are known for performing ${genres.join(', ')} music.` : ''}
        ${country ? `They are from ${country}.` : ''}
        ${activeYears?.begin ? `They began their career in ${activeYears.begin}.` : ''}
        ${gender ? `The artist identifies as ${gender}.` : ''}

        Please include:
        - Their musical style and influences
        - Their impact on the music industry
        - Notable achievements and career highlights
        - Their artistic evolution

        Format the biography in a concise, professional manner suitable for a music platform. 
        Keep it between 150-200 words.
        Do not include speculative information or unverified facts.
        Focus on their musical career and artistic contributions.`;
    }

    private cleanBioText(bio: string): string {
        return bio
            .trim()
            // Remove any markdown formatting
            .replace(/[#*_]/g, '')
            // Remove multiple consecutive newlines
            .replace(/\n{3,}/g, '\n\n')
            // Remove any quotes
            .replace(/[""]/g, '')
            // Ensure proper spacing after periods
            .replace(/\.(?=[A-Z])/g, '. ');
    }
} 