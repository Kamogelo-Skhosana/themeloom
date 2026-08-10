import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// A static server for the examples and the docs playground. No dependency, and
// nothing here is meant to run in production.
const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const root = resolve(repoRoot, process.argv[2] ?? '.');
const port = Number(process.argv[3] ?? 4321);
const openPath = process.argv[4] ?? '/';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.map': 'application/json',
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let filePath = join(root, normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, ''));

  try {
    if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('404');
    return;
  }

  if (!filePath.startsWith(root)) {
    response.writeHead(403).end('403');
    return;
  }

  try {
    statSync(filePath);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end(`404 ${url.pathname}`);
    return;
  }

  response.writeHead(200, {
    'content-type': TYPES[extname(filePath)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`\n  serving ${root}\n  → http://localhost:${port}${openPath}\n`);
});
