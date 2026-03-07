import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer } from 'node:http'

const PORT = Number(process.env.PORT || 4173)
const DIST_DIR = join(process.cwd(), 'dist')

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function safePathFromUrl(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  return join(DIST_DIR, clean)
}

function sendFile(res, filePath) {
  const ext = extname(filePath).toLowerCase()
  const type = MIME_TYPES[ext] || 'application/octet-stream'
  const stat = statSync(filePath)

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })

  createReadStream(filePath).pipe(res)
}

if (!existsSync(join(DIST_DIR, 'index.html'))) {
  console.error('dist/index.html not found. Run "npm run build" before start.')
  process.exit(1)
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  let filePath = safePathFromUrl(url.pathname)

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return sendFile(res, filePath)
  }

  // SPA fallback
  return sendFile(res, join(DIST_DIR, 'index.html'))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server is running on 0.0.0.0:${PORT}`)
})

