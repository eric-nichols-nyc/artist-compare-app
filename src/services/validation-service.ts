import { artistFormSchema } from "@/validations/artist-form-schema";
import { ArtistFormState, analyticsSchema, fullArtistSchema, artistSchema, videoSchema } from "@/validations/artist-schema";
import { z } from "zod";        
// validate the form and send back boolean and errors

interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string> | null;
}

export class ValidationService{
    static async validateForm(formData: ArtistFormState): Promise<ValidationResult>{
        try{
            const result = await fullArtistSchema.safeParseAsync({
                artistInfo: formData.artistInfo,
                analytics: formData.analytics,
                videos: formData.videos,
                tracks: formData.tracks,
                similarArtists: formData.similarArtists,
            })

            if(!result.success){
                const errors = this.formatZodErrors(result.error)
                return {
                    isValid: false,
                    errors: errors
                }
            }
            return {
                isValid: true,
                errors: null
            }
         
        }catch(error){
            console.log(error)
            return {
                isValid: false,
                errors: { general: 'An error occurred during validation' } 
            }
        }
    }

    static async validateSection(
        section: keyof ArtistFormState, 
        data: unknown
      ): Promise<ValidationResult> {
        try {
          const schema = this.getSectionSchema(section);
          const result = await schema.safeParseAsync(data);
    
          if (!result.success) {
            const errors = this.formatZodErrors(result.error, section);
            return { isValid: false, errors };
          }
    
          return { isValid: true, errors: null };
        } catch (error) {
          console.error(`Validation error in ${section}:`, error);
          return { 
            isValid: false, 
            errors: { [section]: 'Validation failed' } 
          };
        }
      }

      private static getSectionSchema(section: keyof ArtistFormState) {
        switch (section) {
          case 'artistInfo':
            return artistSchema;
          case 'analytics':
            return analyticsSchema;
          case 'videos':
            return videoSchema;
          case 'tracks':
            return artistFormSchema.shape.spotifyTracks;
          default:
            throw new Error(`No schema defined for section: ${section}`);
        }
      }
    

    private static formatZodErrors(
        error: z.ZodError, 
        prefix?: string
      ): Record<string, string> {
        return error.errors.reduce((acc, curr) => {
          const path = prefix 
            ? `${prefix}.${curr.path.join('.')}` 
            : curr.path.join('.');
          acc[path] = curr.message;
          return acc;
        }, {} as Record<string, string>);
      }
    
}