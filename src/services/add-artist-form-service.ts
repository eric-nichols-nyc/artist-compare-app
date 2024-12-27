import { createClient } from '@supabase/supabase-js';
import { validateArtistForm, type ArtistFormData } from './validations/artist-form-schema';
import { OpenAIService } from './openai-service';
import { ArtistIngestionService } from './artist-ingestion-service';
import { SpotifyService } from './spotify-service';

// Initialize services
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const openAIService = new OpenAIService();
const artistIngestionService = new ArtistIngestionService();

interface SubmissionResult {
  success: boolean;
  data?: any;
  error?: string;
  validationErrors?: Record<string, string>;
}

export class ArtistFormSubmissionService {
  /**
   * Main submission handler
   */
  public async submitArtistForm(formData: unknown): Promise<SubmissionResult> {
    try {
      // Step 1: Validate form data
      const validationResult = await validateArtistForm(formData);
      
      if (!validationResult.success) {
        return {
          success: false,
          validationErrors: validationResult.errors,
        };
      }

      const validatedData = validationResult.data;

      // Step 2: Begin transaction
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .insert({
          name: validatedData.artistInfo.name,
          spotify_id: validatedData.artistInfo.spotifyId,
          last_fm_id: validatedData.artistInfo.lastFmId,
          youtube_channel_id: validatedData.artistInfo.youtubeChannelId,
          bio: validatedData.artistInfo.bio,
          genres: validatedData.artistInfo.genres,
          image_url: validatedData.artistInfo.imageUrl,
          youtube_url: validatedData.artistInfo.youtubeUrl,
          spotify_url: validatedData.artistInfo.spotifyUrl,
          tiktok_url: validatedData.artistInfo.tiktokUrl,
          instagram_url: validatedData.artistInfo.instagramUrl,
        })
        .select()
        .single();

      if (artistError) {
        throw new Error(`Failed to insert artist: ${artistError.message}`);
      }

      // Step 3: Process analytics data
      await this.processAnalytics(artist.id, validatedData.analytics);

      // Step 4: Process media content
      await Promise.all([
        this.processYoutubeVideos(artist.id, validatedData.youtubeVideos),
        this.processSpotifyTracks(artist.id, validatedData.spotifyTracks),
      ]);

      // Step 5: Process similar artists
      await this.processSimilarArtists(artist.id, validatedData.similarArtists);

      // Step 6: Generate and store embeddings for artist comparison
      await this.generateArtistEmbeddings(artist.id, validatedData);

      return {
        success: true,
        data: artist,
      };

    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Handle analytics data
   */
  private async processAnalytics(artistId: string, analytics: ArtistFormData['analytics']) {
    const { error } = await supabase
      .from('artist_analytics')
      .insert({
        artist_id: artistId,
        date: new Date().toISOString().split('T')[0],
        monthly_listeners: analytics.monthlyListeners,
        youtube_subscribers: analytics.youtubeSubscribers,
        youtube_total_views: analytics.youtubeTotalViews,
        lastfm_play_count: analytics.lastfmPlayCount,
        spotify_followers: analytics.spotifyFollowers,
        spotify_popularity: analytics.spotifyPopularity,
        instagram_followers: analytics.instagramFollowers,
        facebook_followers: analytics.facebookFollowers,
        tiktok_followers: analytics.tiktokFollowers,
        soundcloud_followers: analytics.soundcloudFollowers,
      });

    if (error) throw error;
  }

  /**
   * Handle YouTube videos
   */
  private async processYoutubeVideos(artistId: string, videos: ArtistFormData['youtubeVideos']) {
    if (videos.length === 0) return;

    const { error } = await supabase
      .from('artist_videos')
      .insert(
        videos.map(video => ({
          artist_id: artistId,
          youtube_id: video.videoId,
          title: video.title,
          view_count: video.viewCount,
          like_count: video.likeCount,
          comment_count: video.commentCount,
          published_at: video.publishedAt,
        }))
      );

    if (error) throw error;
  }

  /**
   * Handle Spotify tracks
   */
  private async processSpotifyTracks(artistId: string, tracks: ArtistFormData['spotifyTracks']) {
    if (tracks.length === 0) return;

    const { error } = await supabase
      .from('artist_top_tracks')
      .insert(
        tracks.map(track => ({
          artist_id: artistId,
          platform_track_id: track.trackId,
          name: track.name,
          popularity: track.popularity,
          platform: 'spotify',
        }))
      );

    if (error) throw error;
  }

  /**
   * Handle similar artists
   */
  private async processSimilarArtists(artistId: string, similarArtists: ArtistFormData['similarArtists']) {
    // First ensure all similar artists exist in the database
    const artistPromises = similarArtists.map(async (similarArtist) => {
      const { data: existingArtist } = await supabase
        .from('artists')
        .select('id')
        .eq('name', similarArtist.name)
        .single();

      if (!existingArtist) {
        // If artist doesn't exist, fetch their data and create them
        const spotifyData = await SpotifyService.searchArtist(similarArtist.name);
        const { data: newArtist } = await supabase
          .from('artists')
          .insert({
            name: similarArtist.name,
            spotify_id: spotifyData?.artist?.id,
            genres: spotifyData?.artist?.genres || [],
          })
          .select()
          .single();

        return {
          artist_id: artistId,
          similar_artist_id: newArtist.id,
          similarity_score: similarArtist.match,
        };
      }

      return {
        artist_id: artistId,
        similar_artist_id: existingArtist.id,
        similarity_score: similarArtist.match,
      };
    });

    const similarityRecords = await Promise.all(artistPromises);

    const { error } = await supabase
      .from('artist_similarities')
      .insert(similarityRecords);

    if (error) throw error;
  }

  /**
   * Generate and store artist embeddings
   */
  private async generateArtistEmbeddings(artistId: string, data: ArtistFormData) {
    // Create embedding text from artist data
    const embeddingText = `${data.artistInfo.name} ${data.artistInfo.bio || ''} 
      ${data.artistInfo.genres.join(' ')} ${data.spotifyTracks.map(t => t.name).join(' ')}`;

    // Generate embedding using OpenAI
    const embedding = await openAIService.generateEmbedding(embeddingText);

    // Store embedding
    const { error } = await supabase
      .from('artist_comparisons')
      .insert({
        artist1_id: artistId,
        embedding,
        source: 'form_submission',
      });

    if (error) throw error;
  }

  /**
   * Update existing artist
   */
  public async updateArtist(artistId: string, formData: unknown): Promise<SubmissionResult> {
    try {
      const validationResult = await validateArtistForm(formData);
      
      if (!validationResult.success) {
        return {
          success: false,
          validationErrors: validationResult.errors,
        };
      }

      const validatedData = validationResult.data;

      // Update artist basic info
      const { error: updateError } = await supabase
        .from('artists')
        .update({
          name: validatedData.artistInfo.name,
          bio: validatedData.artistInfo.bio,
          genres: validatedData.artistInfo.genres,
          image_url: validatedData.artistInfo.imageUrl,
          youtube_url: validatedData.artistInfo.youtubeUrl,
          spotify_url: validatedData.artistInfo.spotifyUrl,
          tiktok_url: validatedData.artistInfo.tiktokUrl,
          instagram_url: validatedData.artistInfo.instagramUrl,
        })
        .eq('id', artistId);

      if (updateError) throw updateError;

      // Update related data
      await Promise.all([
        this.processAnalytics(artistId, validatedData.analytics),
        this.updateYoutubeVideos(artistId, validatedData.youtubeVideos),
        this.updateSpotifyTracks(artistId, validatedData.spotifyTracks),
        this.updateSimilarArtists(artistId, validatedData.similarArtists),
      ]);

      return {
        success: true,
      };

    } catch (error) {
      console.error('Update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Update YouTube videos
   */
  private async updateYoutubeVideos(artistId: string, videos: ArtistFormData['youtubeVideos']) {
    // Remove existing videos
    await supabase
      .from('artist_videos')
      .delete()
      .eq('artist_id', artistId);

    // Add new videos
    if (videos.length > 0) {
      await this.processYoutubeVideos(artistId, videos);
    }
  }

  /**
   * Update Spotify tracks
   */
  private async updateSpotifyTracks(artistId: string, tracks: ArtistFormData['spotifyTracks']) {
    // Remove existing tracks
    await supabase
      .from('artist_top_tracks')
      .delete()
      .eq('artist_id', artistId);

    // Add new tracks
    if (tracks.length > 0) {
      await this.processSpotifyTracks(artistId, tracks);
    }
  }

  /**
   * Update similar artists
   */
  private async updateSimilarArtists(artistId: string, similarArtists: ArtistFormData['similarArtists']) {
    // Remove existing similarities
    await supabase
      .from('artist_similarities')
      .delete()
      .eq('artist_id', artistId);

    // Add new similarities
    await this.processSimilarArtists(artistId, similarArtists);
  }
}

// Export singleton instance
export const artistFormService = new ArtistFormSubmissionService();