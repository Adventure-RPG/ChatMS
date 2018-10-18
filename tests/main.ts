'use strict'

import * as socketIo from 'socket.io-client';
import * as chai from 'chai';
import {Config} from "../config";
import Socket = SocketIOClient.Socket;


const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
};

let testMsg = {"text": "Hello world!"},
    sender: Socket,
    receiver: Socket;

const CONNECTION_NUM = 2;
let users = [];

describe('Chat Events', () => {
    beforeEach((done) => {
        // connect two io clients
      for (let i = 0; i < CONNECTION_NUM; i++) {
          users.push(socketIo(`http://localhost:${Config.port}/`, ioOptions));
      }

        // finish beforeEach setup
        done()
    });

    afterEach((done) => {
        for(let i = 0; i < CONNECTION_NUM; i++) {
          // disconnect io clients after each test
            users[i].disconnect();
        }
        done();
    });

    describe('Message Events', () => {
      it('Clients should receive a message when the `message` event is emited.', async (done) => {
        let testMsgStr = JSON.stringify(testMsg);
        for (let i = 0; i < CONNECTION_NUM; i++) {
          users[i].on('message', (msg: any) => {
            chai.expect(JSON.stringify(msg)).to.equal(testMsgStr);
            if (i === CONNECTION_NUM - 1) {
                done();
            }
          });
          await users[i].emit('message', testMsg);
        }
      });
    });

    describe('Date Events', () => {
      it('Clients should receive a date with datetime from server.', (done) => {
        let testDate = {datetime: {time: new Date().getTime()}};
        for (let i = 0; i < CONNECTION_NUM; i++) {
          users[i].on('datetime', (msg: any) => {
            chai.expect(msg).to.have.property('datetime').to.have.property('time');
            if (i === CONNECTION_NUM - 1) {
                done();
            }
          });
          users[i].emit('datetime', testDate);
        }
      });
    });
});
