import * as express from 'express';
import * as socketIo from 'socket.io';
import { Server, createServer } from 'http';
import { Config } from '../config';

const app: express.Application = express();
const port: string | number = Config.port || process.env.PORT;
const server: Server = createServer(app);
const io = socketIo(server);

io.on('connection', (socket: any) => {
  socket.on('message', (msg: string) => {
    io.sockets.emit('message', msg);
  });
});

// Set port for listen on server
server.listen(port, () => {
  //  TODO: переделать запись в файл для продакшен версии
  console.log('Running server on port %s', port);
});
