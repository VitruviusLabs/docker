import { Server } from "http";
import { log } from "./log.mjs";

async function startServer() {
  const server: Server = new Server();

  server.on('request', (request, response) => {
    log(`Received request on ${request.url} from ${request.socket.remoteAddress}`);

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('200 - OK');
  });

  server.listen(80, () => {
    log('Server started on port 80');
  });
}

export { startServer };
