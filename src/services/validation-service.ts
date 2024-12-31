import { z } from "zod";    
import { ArtistFormState } from "@/types/artist";
import { artistInfoSchema } from "@/validations/artist-form-schema";


export class ValidationService{
    static async validateForm(data: ArtistFormState){
        const artistInfo = artistInfoSchema.parse(data.artistInfo);
        const analytics = analyticsSchema.parse(data.analytics);
    }
}