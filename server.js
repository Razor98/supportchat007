
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
var users = [];
var conf;
const WAIT_FRAME_TIMEOUT = 2000;
var lstSent = 1;

const COMMANDS = {
    eino: 'non'
}
var connections = {};
var connectionIDCounter = 0;
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
wss.on('connection', function connection(ws) {
    ws.send('AUTH 0');
    console.log("new connection " + ws.id);
//    var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
   // clients.push(ws);
  //  ws.send('AUTH_OK ' + id);
 //   if (clients.indexOf(id) == -1) {
 //       ws.send('AUTH_OK ' + id);
 //       console.log("new connection " + id);
  // } else {
//     ws.send('AUTH_CLOSE ' + id);  
 //     }//если айди совпадают
    //ws.id = connectionIDCounter++;
  //  connections[ws.id] = ws;
    ws.on('message', function incoming(message) {//если что то пришло
        console.log('message ' + message);
      //  users[message.userName] = ws;
        info = message;
        ws.send('AUTH 1');
        var keyname;
        if (message.indexOf('id:') != -1) {
            var name = message.split(':')[1];
            users[name] = ws;
            for (var key in users) {
                keyname = keyname + '{id:' + users + '}';
            }
            ws[name].send('AUTH 2 ' + keyname);
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
        console.log('close connection ' + ws.id);
        //delete clients[id];
        delete connections[ws.id];
    });
    ws.on('error', function () {
        console.log('error connection ' + ws.id);
       // delete clients[id];
        delete connections[ws.id];
    });
    var interval;
   // interval = setInterval(() => {
  //      if (current - lstSent > 0) {
   //         lstSent = current;
   //         if (new Date().valueOf() - current > WAIT_FRAME_TIMEOUT) {
   //             ws.close;
   //             return 0;
   //         }
    //        ws.send('AUTH 7 ' + new Date().valueOf() - current);
   //     }

  //  }, 1000 / 24);
    if (ws.readyState === true) {
        setInterval(function () {
            ws.send('AUTH 7 ');
        }, 8000);
    }
    console.log('Connected', ws.url);
});
