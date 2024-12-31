import { ArtistFormState } from "@/types/artist";
import { artistSchema, analyticsSchema, spotifyTrackSchema, videoSchema } from "@/validations/artist-schema";
import { z } from "zod";    


export class ValidationService{
    static async validateForm(data: ArtistFormState){
        const artistInfo = artistSchema.parse(data.artistInfo);
        const analytics = analyticsSchema.parse(data.analytics);
    }
}