import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.ico':'image/x-icon'};
const inside = (root, file) => {const rel = relative(root, file);return rel !== '..' && !rel.startsWith('..' + sep) && !isAbsolute(rel);};

// Local development only: serves dist/, never the repository or .openai/.
export async function createDevServer() {
  const root = await realpath(resolve(projectRoot, 'dist'));
  return http.createServer(async (req, res) => {
    const reply = (code, message) => {res.writeHead(code, {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end(req.method === 'HEAD' ? '' : message);};
    if (!['GET', 'HEAD'].includes(req.method)) {res.setHeader('Allow', 'GET, HEAD');reply(405, 'Method not allowed');return;}
    try {
      let pathname;
      try {pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);} catch {reply(400, 'Invalid URL');return;}
      if (pathname.includes('\0') || pathname.includes('\\')) {reply(400, 'Invalid path');return;}
      if (pathname.endsWith('/')) pathname += 'index.html';
      const requested = resolve(root, '.' + pathname);
      if (!inside(root, requested)) {reply(403, 'Forbidden');return;}
      const file = await realpath(requested);
      if (!inside(root, file)) {reply(403, 'Forbidden');return;}
      if (!(await stat(file)).isFile()) {reply(404, 'Not found');return;}
      const content = await readFile(file);
      res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Content-Length':content.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) {reply(['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, ['ENOENT', 'ENOTDIR'].includes(error.code) ? 'Not found' : 'Unable to serve file');}
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = process.env.TRIBUDDY_HOST || '127.0.0.1';
  const port = Number(process.env.TRIBUDDY_PORT || 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('TRIBUDDY_PORT must be 1–65535');
  const server = await createDevServer();
  server.on('error', error => {console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Set TRIBUDDY_PORT to another port.` : error.message);process.exitCode = 1;});
  server.listen(port, host, () => console.log(`Съедобная атлетика: http://${host}:${port}/\nCtrl+C — остановить. Изменения видны после обновления страницы.`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {server.closeAllConnections();server.close(() => process.exit(0));});
}
