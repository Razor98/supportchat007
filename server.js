'use strict';
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

var info = new Buffer('', "ascii");
var current = new Date().valueOf();
var clients = ['53'];

const COMMANDS = {
    eino: 'non'
}

wss.on('connection', function connection(ws) {
    var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if (clients.indexOf(id) != -1) {
        clients[id] = ws;
        ws.send('AUTH_OK ' + id);
        console.log("new connection " + id);
        } else {
        ws.send('AUTH_CLOSE ' + id);  
        }//åñëè àéäè ñîâïàäàþò
 
    ws.on('message', function incoming(message) {//åñëè ÷òî òî ïðèøëî
        console.log('message ' + message);
        for (var key in clients) {//ïåðåáîð âñåõ êëèåíòîâ è îòïðàâêà âñåì ñîîáùåíèÿ
            info = message;
            clients[key].send(message);
        }
    });

    ws.on('close', function () {
        console.log('close connection ' + id);
        delete clients[id];
    });

    console.log('Connected', ws.url);
});
