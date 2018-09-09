'use strict'
import {expect} from 'chai';
import {Config} from "../config";
import * as redis from 'redis';

let sub, pub;

describe('Redis Events', () => {
  beforeEach((done) => {

      // connect two io clients
      sub = redis.createClient({url:`${Config.redis_url}`});
      pub = redis.createClient({url:`${Config.redis_url}`});

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
    let channelName = "test_channel",
        testMsg = "test_message";

    sub.on("subscribe", (channel, count) => {
      pub.publish(channelName, testMsg);
    });

    sub.on("message", (channel, message) => {
      expect(channel).to.equal(channelName);
      expect(message).to.equal(testMsg);
      sub.unsubscribe();
      done();
    });
    sub.subscribe(channelName);
  });
});
