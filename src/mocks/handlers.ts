import { http } from 'msw'

export const handlers = [
  http.post('/api/admin/add-artist', async () => {
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  })
] 