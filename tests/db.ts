'use strict'
import * as chai from 'chai';
import {Config} from "../config";
import * as redis from 'redis';


describe('Redis Events', () => {
  it('Should connect to redis server.', (done) => {
    let client = redis.createClient({url:`${Config.redis_url}`});
    done();
  });
});
