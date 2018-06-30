'use strict';
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

var info = new Buffer('');
var current = new Date().valueOf();
var clients = {};

const COMMANDS = {
    confirmFileReceived: 'c0'
}

wss.on('connection', function connection(ws) {
    var id = Math.random();
    clients[id] = ws;
    console.log("new connection " + id);
    ws.on('message', function incoming(message) {//если что то пришло
        console.log('message ' + message);
        for (var key in clients) {//перебор всех клиентов и отправка всем сообщения
            info = message;
            clients[key].send(message);
        }
    });

    ws.on('close', function () {
        console.log('close connection ' + id);
        delete clients[id];
    });

    console.log('Connected', ws.url);
    ws.send('NUM#');
});
