
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

var info = new Buffer('', "ascii");
var current = new Date().valueOf();
var users = [];


const COMMANDS = {
    eino: 'non'
}
function noop() { }

function heartbeat() {
    this.isAlive = true;
}
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.send('AUTH 0');
    console.log("new connection " + users.values);
//    var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
   // clients.push(ws);
  //  ws.send('AUTH_OK ' + id);
 //   if (clients.indexOf(id) == -1) {
 //       ws.send('AUTH_OK ' + id);
 //       console.log("new connection " + id);
  // } else {
//     ws.send('AUTH_CLOSE ' + id);  
 //     }//���� ���� ���������
    //ws.id = connectionIDCounter++;
  //  connections[ws.id] = ws;
    ws.on('message', function incoming(message) {//���� ��� �� ������
        console.log('message ' + message);
      //  users[message.userName] = ws;
        info = message;
        var keyname = '';
        if (message.indexOf('id=') != -1) {
            var name = message.split(':')[1];
            users[name] = ws;
     //       users[name].sockets.push(connection);
            for (var key in users) {
                keyname = keyname + '{id:' + key + '}';
            }
            users[name].send('AUTH 1 ' + keyname);
            delete name;
        }
        delete keyname;
//        wss.clients.forEach(function each(client) {
//            if (client !== ws && client.readyState === WebSocket.OPEN) {
//                client.send(info);
//            }
     //   });
       //     for (var key in clients) {
     //           clients[key].send(info);             
      //      }
    });
    ws.on('close', function () {
        console.log('close connection ' + users.values);
        //delete users[ws.eventNames];
    });
    ws.on('error', function () {
       // console.log('error connection, delete user ' + users[name]);
        //delete users[name];
    });
    console.log('Connected', ws.url);
});
