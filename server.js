
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
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};
wss.on('connection', function connection(ws) {
    ws.id = wss.getUniqueID();

    wss.clients.forEach(function each(client) {
        console.log('Client.ID: ' + client.id);
        ws.send('AUTH_OK ' + client.id);
    });

  //  var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
  //  if (clients.indexOf(id) == -1) {
 //       clients.push(ws);
  //      ws.send('AUTH_OK ' + id);
 //       console.log("new connection " + id);
 //   } else {
  //      ws.send('AUTH_CLOSE ' + id);  
  //      }//если айди совпадают
 
    ws.on('message', function incoming(message) {//если что то пришло
        console.log('message ' + message);
            info = message;
           'clients[client.id].send(info);
    });

    ws.on('close', function () {
        console.log('close connection ' + id);
        delete clients[id];
    });

    console.log('Connected', ws.url);
});
