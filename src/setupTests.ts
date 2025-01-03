import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server'
import { beforeAll, afterEach, afterAll } from 'vitest'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close()) 