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
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var O = Object(this);
            var len = O.length >>> 0;

            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 9. Пока k < len, будем повторять
            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }
    var id = Math.floor(Math.random() * (99999999 - 0 + 1)) + 0;
    if (clients.indexOf(id) == -1) {
        clients[id] = ws;
        ws.send('AUTH_OK ' + id);
        console.log("new connection " + id);
        } else {
        ws.send('AUTH_CLOSE ' + id);  
        }//если айди совпадают
 
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
