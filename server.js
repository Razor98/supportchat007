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
var clients = {};

const COMMANDS = {
    eino: 'non'
}

wss.on('connection', function connection(ws) {
    var id = Math.floor(Math.random() * (99999999 - 0 + 1)) + 0;
    for (var ewq in clients) {
        if (ewq == id) {ws.send('AUTH_CLOSE ' + id); } else {clients[id] = ws;ws.send('AUTH_OK ' + id);console.log("new connection " + id);}//если айди совпадают
    }
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
});
