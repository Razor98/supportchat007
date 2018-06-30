'use strict';
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
//   .use((req, res) => res.sendFile(INDEX) )
const wss = new SocketServer({ server });

const WAIT_FRAME_TIMEOUT = 2000;
var screenFrame = new Buffer('');
var lstSent = 1;
var current = new Date().valueOf();

const COMMANDS = {
    confirmFileReceived: 'c0'
}

wss.on('connection', function connection(ws) {
    var interval;

    ws.on('message', function incoming(message) {
        // watcher
        if (message == 'client') {
            interval = setInterval(() => {
                // do not send the same pic
                if (current - lstSent > 0) {
                    var toSend = screenFrame;
                    lstSent = current;
                    if (new Date().valueOf() - current > WAIT_FRAME_TIMEOUT) {
                        ws.send('no_stream');
                        screenFrame = new Buffer.from([]);
                        return 0;
                    }
                    ws.send(toSend);
                }

            }, 1000 / 24);
        } else {
            // sender
            if (Buffer.isBuffer(message)) {
                current = new Date().valueOf();
                screenFrame = message;
                ws.send(COMMANDS.confirmFileReceived);
            }
        }
    });

    ws.on('close', function () {
        if (interval) {
            clearInterval(interval);
            console.log('client disconected');
        }
    });

    console.log('Socket connecned', ws.url);
    ws.send('CONNECTED');
});