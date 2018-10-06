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
        it('Clients should receive a message when the `message` event is emited.', (done) => {
            let testMsgStr = JSON.stringify(testMsg);
            for (let i = 0; i < CONNECTION_NUM; i++) {
                users[i].on('message', (msg: string) => {
                  chai.expect(msg).to.equal(testMsgStr);
                  if (i == CONNECTION_NUM - 1) done();
                });
                console.log(testMsg);
                users[i].emit('message', testMsg);
            }
        });
    });
});
