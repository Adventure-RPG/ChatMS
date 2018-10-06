'use strict'
import {expect} from 'chai';
import {Config} from "../config";
import * as redis from 'redis';

const redis_url: string = process.env.REDIS_URL || Config.redis_url;

let sub, pub;

describe('Redis Events', () => {
  beforeEach((done) => {

      // connect two io clients
      sub = redis.createClient({url: `${redis_url}`});
      pub = redis.createClient({url: `${redis_url}`});

      // finish beforeEach setup
      done()
  });

  afterEach((done) => {
      // disconnect io clients after each test
      sub.quit();
      pub.quit();
      done();
  });

  it('Should communicate channel between two users', (done) => {
    let channelName = "test_channel", testMsg = {"text":"test_message"};

    sub.on("subscribe", (channel, count) => {
      pub.publish(channelName, JSON.stringify(testMsg));
    });

    sub.on("message", (channel, message: string) => {
      expect(channel).to.equal(channelName);
      expect(message).to.equal(JSON.stringify(testMsg));
      sub.unsubscribe();
      done();
    });
    sub.subscribe(channelName);
  });
});
