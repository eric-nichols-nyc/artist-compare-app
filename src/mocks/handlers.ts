import { rest } from 'msw'

export const handlers = [
  rest.post('/api/admin/add-artist', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Artist added successfully',
        artistId: '123'
      })
    )
  }),

  rest.get('/api/admin/artist-videos', (req, res, ctx) => {
    return res(
      ctx.json({
        videos: [
          {
            title: 'Test Video',
            videoId: 'xyz123',
            statistics: {
              viewCount: '1000',
              likeCount: '100',
              commentCount: '50'
            },
            publishedAt: '2024-03-20T00:00:00Z'
          }
        ]
      })
    )
  }),

  // Add other API mocks as needed
] 