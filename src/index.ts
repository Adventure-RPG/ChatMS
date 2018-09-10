import * as express from 'express';
import * as socketIo from 'socket.io';
import { Server, createServer } from 'http';
import { Config } from '../config';
import * as redis from 'redis';
import { UserIF } from './users';

const app: express.Application = express();
const port: string | number = Config.port || process.env.PORT;
const redis_url: string = process.env.REDIS_URL || Config.redis_url;
const server: Server = createServer(app);
const io = socketIo(server);

const users: { [key: string]: UserIF } = {};

io.on('connection', (socket: any) => {
  const user: UserIF = (users[socket.id] = {
    ws: socket,
    rc: redis.createClient({ url: ` ${redis_url} `, })
  });

  user.rc.on('message', (channel: string, message: string) => {
    socket.emit('message', message);
  });

  socket.on('message', (msg: string) => {
    user.rc.publish(`${Config.main_room}`, msg);
  });

  user.rc.subscribe(`${Config.main_room}`);

  socket.on('disconnect', () => {
    users[socket.id].rc.unsubscribe();
    users[socket].rc.quit();
    delete users[socket.id];
  });
});

// Set port for listen on server
server.listen(port, () => {
  //  TODO: переделать запись в файл для продакшен версии
  console.log('Running server on port %s', port);
});
