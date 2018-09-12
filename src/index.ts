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

const pub: redis.RedisClient = redis.createClient({ url: `${redis_url}` });

io.on('connection', (socket: any) => {
  let user: UserIF;
  user = users[socket.id] = {
    ws: socket,
    rc: redis.createClient({ url: ` ${redis_url} ` })
  };

  user.rc.subscribe(`${Config.main_room}`, () => {
    user.rc.on('message', (channel: string, message: string) => {
      socket.emit('message', message);
    });
  });

  socket.on('message', (msg: string) => {
    try {
      pub.publish(`${Config.main_room}`, msg);
    } catch (e) {
      console.log(e);
    }
  });

  try {
    socket.on('disconnect', () => {
      users[socket.id].rc.unsubscribe();
      if (users[socket] && users[socket].rc) {
        users[socket].rc.quit();
      }
      delete users[socket.id];
    });
  } catch (e) {
    console.log(e);
  }
});

// Set port for listen on server
server.listen(port, () => {
  //  TODO: переделать запись в файл для продакшен версии
  console.log('Running server on port %s', port);
});
