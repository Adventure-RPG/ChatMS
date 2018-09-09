import * as socketIo from 'socket.io';
import * as redis from 'redis';

export interface UserIF {
  ws: socketIo.Socket;
  rc: redis.RedisClient;
}
