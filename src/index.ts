import { serve } from '@hono/node-server'
import app from './app'

const port = 4000
console.log(`Server running at http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
    hostname: "localhost",
})