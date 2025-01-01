import { SpotifyService } from "@/services/spotify-service";
import { NextResponse } from "next/server";
import { SimilarArtist } from "@/validations/artist-form-schema";
import { SimilarSpotifyArtistWithMatch } from "@/types";


export async function GET(req: Request): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    try {
        const similarSpotifyArtists: SimilarSpotifyArtistWithMatch[] = await SpotifyService.getSimilarArtists(name);
        const similarSpotifyArtistsWithGenres= similarSpotifyArtists.map((artist) => ({
            name: artist.name,
            id: artist.id,
            imageUrl: artist.images[0].url,
            genres: artist.genres.slice(0, 3),
            match: artist.match
        })) as SimilarArtist[];

        // console.log('similarSpotifyArtistsWithGenres', similarSpotifyArtistsWithGenres);

        return NextResponse.json(similarSpotifyArtistsWithGenres);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch similar Spotify artists' }, { status: 500 })
    }

}