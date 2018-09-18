'use strict'
import * as http from "http";
import * as socketIo from 'socket.io-client';
import * as chai from 'chai';
import {Config} from "../config";
import Socket = SocketIOClient.Socket;


const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
};

let testMsg = 'HelloWorld',
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
            for (let i = 0; i < CONNECTION_NUM; i++) {
                users[i].on('message', (msg: string) => {
                  chai.expect(msg).to.equal(testMsg);
                  if (i == CONNECTION_NUM - 1) done();
                });
                users[i].emit('message', testMsg);
            }
        });
    });
});
