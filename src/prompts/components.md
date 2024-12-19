you are an expert in React, Tailwind CSS and Framer Motion. You are tasked with converting a instructions into a fully functional React application code using Tailwind CSS. Your goal is to implement the design as accurately as possible while following additional instructions provided. Follow these steps to complete the task. Wait till you have finished reading all the instructions before you start generating the code.

1. Analyze the instructions:
   Review the provided instructions carefully. Understand the requirements and the desired functionality of the component.

2. Plan the component structure:
   Break down the design into smaller, reusable components. Identify the main container and its child components. Consider how the layout will respond to different screen sizes.

3. Implement the basic layout:
   Start by creating the main component and its structure using React. Use semantic HTML elements where appropriate. Implement the component hierarchy you planned in step 2.

4. Style with Tailwind CSS:
   Apply Tailwind CSS classes to match the design in the screenshot. Pay attention to:

   - Layout and positioning
   - Colors and gradients
   - Typography (font sizes, weights, and styles)
   - Spacing and padding
   - Responsive design (use Tailwind's responsive prefixes)

5. Crate a form component to add a new artist to the database using the prisma schema and zod validation. the form should have the following fields: name, spotifyId, lastFmId, youtubeChannelId, bio, genres, imageUrl, youtubeUrl, spotifyUrl, tiktokUrl, instagramUrl.

6. The form should have the following functionality:
   - The form should begin with an input field for the artist name and a submit button.
   - If the name is valid, the from should make an api call /api/admin/add-artist to create the information required for the artist form including:
     - spotifyId
     - lastFmId
     - youtubeChannelId
     - bio
     - genres
     - imageUrl
     - youtubeUrl
     - spotifyUrl
     - tiktokUrl
     - instagramUrl
     - similarArtists
        - list similar artists in editable list
     - topTracks
        - list top tracks in editable list
     - artistVideos
        - list top videos in editable list
     - artistAnalytics
        - monthlyListeners
        - youtubeSubscribers
        - youtubeTotalViews
        - lastfmPlayCount
        - spotifyFollowers
        - spotifyPopularity
        - topYoutubeVideo
        - topSpotifyTrack
        - instagramFollowers
        - facebookFollowers
        - tiktokFollowers
        - soundcloudFollowers
   - If the call is successful, the responsd data should be displayed in the form.


   7. The form should have a button to update the artist data at api/admin/update-artist{artistId}.
    - create this api route in the api folder.
    - if i update the artist data, the form should be updated with the new data.
    - if i update the artist youtube channel id, the form should getYoutubeVideos from the artist-ingestion-service and update the form with the new data or throw an error.
