
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

var info = new Buffer('', "ascii");
var current = new Date().valueOf();
var clients = [];

const COMMANDS = {
    eino: 'non'
}
function sendinf(message) {
    for (var i = 0; i < CLIENTS.length; i++) {
        clients[i].send(message);
    }
}
wss.on('connection', function connection(ws) {
    var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if (clients.indexOf(id) == -1) {
        clients.push(ws);
        ws.send('AUTH_OK ' + id);
        console.log("new connection " + id);
    } else {
        ws.send('AUTH_CLOSE ' + id);  
        }//если айди совпадают
 
    ws.on('message', function incoming(message) {//если что то пришло
        console.log('message ' + message);
            info = message;
            sendinf(info);
    });

    ws.on('close', function () {
        console.log('close connection ' + id);
        delete clients[id];
    });

    console.log('Connected', ws.url);
});
