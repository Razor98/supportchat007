
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new SocketServer({ server });

var identification = '1';
var current = new Date().valueOf();
var users = {};
var chats = {};
var connections = 0;
var myname;
const COMMANDS = {
    eino: 'non'
}
function noop() { }

function heartbeat() {
    this.isAlive = true;
}
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log('delete user ' + myname);
            delete users[myname];
            //delete chats[myname];
            try {
                wss.clients.forEach(function each(client) {
                    if (client !== ws) {
                        client.send('AUTH DEL_USER {' + myname + '}');
                    }
                });
            } catch (err) {
                console.log('error REF  ' + err);
            }
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);
const intervaltest = setInterval(function test() {
    for (var test in users) {
        try {
            users[test].send('PING');
        } catch (err) {
            console.log('delete user bad connect ' + test);
            delete users[test];         
            try {
                wss.clients.forEach(function each(client) {
                        client.send('AUTH DEL_USER {' + test + '}');
                });
            } catch (err) {
                console.log('error REF  ' + err);
            }
        }
    }
    for (var testc in chats) {
        try {
            chats[testc].send('PING');
        } catch (err) {
            console.log('delete chats bad connect ' + testc);
            delete chats[testc];
        }
    }
}, 26000);
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
    connections = connections + 1;
    console.log('new connection ' + connections);
//    var id = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    ws.on('message', function incoming(message) {//если что то пришло
        // console.log('message ' + message);
        //info = message;
        if (message.indexOf('IDENTIFICATION PROTOCOL ' + identification) != -1) {
            if (message.indexOf('id=') != -1) {
                var protekt = message.split('=')[1];;
                if (users.length > 0) {
                    for (var keyp in users) {
                        if (keyp.indexOf(protekt) != -1) {
                        } else {
                            //wss.broadcast('AUTH REF', client => client !== ws);
                            try {
                                var keyname = '';
                                var name = message.split('=')[1];
                                users[name] = ws;
                                myname = name
                                try {
                                    wss.clients.forEach(function each(client) {
                                        if (client !== ws) {
                                            client.send('AUTH NEW {' + name + '}');
                                        }
                                    });
                                } catch (err) {
                                    console.log('error REF  ' + err);
                                }
                                //       users[name].sockets.push(connection);
                                for (var key in users) {
                                    keyname = keyname + '{id:' + key + '}';
                                }
                                users[name].send('AUTH 1 ' + keyname);
                                delete name;
                                delete keyname;
                            } catch (err) {
                                console.log('error ID  ' + err);
                            }
                        }
                    }
                    delete protekt;
                } else {
                    try {
                        var keyname = '';
                        var name = message.split('=')[1];
                        users[name] = ws;
                        myname = name
                        try {
                            wss.clients.forEach(function each(client) {
                                if (client !== ws) {
                                    client.send('AUTH NEW {' + name + '}');
                                }
                            });
                        } catch (err) {
                            console.log('error REF  ' + err);
                        }
                        //       users[name].sockets.push(connection);
                        for (var key in users) {
                            keyname = keyname + '{id:' + key + '}';
                        }
                        users[name].send('AUTH 1 ' + keyname);
                        delete name;
                        delete keyname;
                    } catch (err) {
                        console.log('error ID  ' + err);
                    }
                }

            } else if (message.indexOf('PON5') != -1) {
                // var name = message.split('=')[1];
                ws.send('TIME_IN');
                //delete name;
            }
        }
        else if (message.indexOf('IDENT 33') != -1) {
            try {
                var keyname = '';
                var recipient = message.split('Z5F3G*HH')[1];
                var sender = message.split('Z5F3G*HH')[2];
                var info = new Buffer(message.split('Z5F3G*HH')[3]);
            } catch (err) {
                console.log('error IDENT 33 block1 ' + err);
            }
            try {
                for (var key in chats) {
                    keyname = keyname + key;
                }
            } catch (err) {
                console.log('error IDENT 33 block2 ' + err);
            }
            if (keyname.indexOf(recipient) != -1) {
                try {
                    chats[recipient].send('IDENT 33 {sender:' + sender + '}{message:' + info + '}');
                } catch (err) {
                    console.log('error IDENT 33 block3 1' + err);
                }
                try {
                    chats[sender].send('IDENT 1 ' + recipient);
                } catch (err) {
                    console.log('error IDENT 33 block3 2' + err);
                }
            } else {
                try {
                    chats[sender].send('IDENT 404 {' + recipient + '}');
                } catch (err) {
                    console.log('error IDENT 33 block3 3' + err);
                }
            }
            delete keyname;
            delete recipient;
            delete info;
            delete sender;

        }
        else if (message.indexOf('RSA 0') != -1) {
            try {
                var keyname = '';
                var recipient = message.split('=')[1];//кому предназначаетс€
                var sender = message.split('=')[2];//кто отправл€ет
                for (var key in chats) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(recipient) != -1) {
                    try {
                        chats[recipient].send('RSA 0 {sender:' + sender + '}');
                    } catch (err) {
                        console.log('error RSA 0 recepient send 01 ' + err);
                    }
                    try {
                        chats[sender].send('RSA 1 ' + recipient);
                    } catch (err) {
                        console.log('error RSA 0 recepient send 02 ' + err);
                    }
                } else {
                    chats[sender].send('RSA 0 404 ' + recipient);
                }
                delete keyname;
                delete recipient;
                delete sender;
            } catch (err) {
                console.log('error RSA 0  ' + err);
            }
        }
        else if (message.indexOf('RSA 2') != -1) {
            try {
                var keyname = '';
                var recipient = message.split('Z5F3G*HH')[1];//кому предназначаетс€
                var sender = message.split('Z5F3G*HH')[2];//кто отправл€ет
                var RSAkey = message.split('Z5F3G*HH')[3];//ключик rsa
                for (var key in chats) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(recipient) != -1) {
                    chats[recipient].send('RSA 2 {sender:' + sender + '}' + '{RSAkey:' + RSAkey + '}');
                    chats[sender].send('RSA 3 OK {' + recipient + '}');
                } else {
                    chats[sender].send('RSA 3 404 ' + recipient);
                }
                delete keyname;
                delete recipient;
                delete sender;
                delete RSAkey;
            } catch (err) {
                console.log('error RSA 2  ' + err);
            }
        } else if (message.indexOf('GET_AVATAR') != -1) {
            try {
                var recipient = message.split('=')[2];//кому предназначаетс€
                var sender = message.split('=')[1];//кто отправл€ет
                for (var key in users) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(recipient) != -1) {
                    users[recipient].send('GET_AVATAR {sender:' + sender + '}');//отправл€ем запрос клиенту на получение аватара другим пользователем
                    users[sender].send('GET AVATAR OK {' + recipient + '}');
                } else {
                    users[sender].send('GET AVATAR 404 ' + recipient);
                }
                delete keyname;
                delete recipient;
                delete sender;
            } catch (err) {
                console.log('error GET AVATAR  ' + err);
            }
        } else if (message.indexOf('SET_AVATAR') != -1) {
            try {
                var recipient = message.split('HHGFRFRR875FFRF')[2];//кому предназначаетс€
                var sender = message.split('HHGFRFRR875FFRF')[1];//кто отправл€ет
                var avatar = message.split('HHGFRFRR875FFRF')[3];
                for (var key in users) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(recipient) != -1) {
                    users[recipient].send('SET_AVATAR {sender:' + sender + '}{avatar:' + avatar + ':end_avatar}');//отправл€ем запрос клиенту на получение аватара другим пользователем
                    users[sender].send('SET AVATAR OK {' + recipient + '}');
                } else {
                    users[sender].send('SET AVATAR 404 ' + recipient);
                }
                delete keyname;
                delete recipient;
                delete sender;
                delete avatar;
            } catch (err) {
                console.log('error SET AVATAR  ' + err);
            }
        } else if (message.indexOf('chat') != -1) {
            var sender = message.split('=')[1];
            var keyname;
            if (chats.length > 0) {
                for (var key in chats) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(sender) != -1) {
                    chats[sender].send('chat available');
                } else {
                    chats[sender] = ws;
                    chats[sender].send('chat available');
                }
            } else {
                chats[sender] = ws;
                chats[sender].send('chat available');
            }
            delete sender;
            delete keyname;
        } else if (message.indexOf('getdialog') != -1) {
            var recipient = message.split('=')[1];
            var sender = message.split('=')[2];
            var keyname;
            for (var key in users) {
                keyname = keyname + key;
            }
            if (keyname.indexOf(recipient) != -1) {
                users[recipient].send('GET_DIALOG_101 {sender:' + sender + '}');
                users[sender].send('GET_DIALOG_106');
            } else {
                users[sender].send('GET_DIALOG_404');
            }
            delete keyname;
            delete sender;
            delete recipient;
        }
        else if (message.indexOf('online_opponent') != -1) {
            var recipient = message.split('=')[1];
            var sender = message.split('=')[2];
            var keyname;
            try {
                for (var key in chats) {
                    keyname = keyname + key;
                }
                if (keyname.indexOf(recipient) != -1) {
                    try {
                        chats[sender].send('Online_OK');
                    } catch (err) { console.log('error online status'); }
                } else {
                    try {
                        chats[sender].send('Online_null');
                    } catch (err) { console.log('error online status'); }
                }
            } catch (err) {'error online globaly'}
            delete keyname;
            delete sender;
            delete recipient;
        }
//        wss.clients.forEach(function each(client) {
//            if (client !== ws && client.readyState === WebSocket.OPEN) {
//                client.send(info);
//            }
     //   });
       //     for (var key in clients) {
     //           clients[key].send(info);             
      //      }
    });
    ws.on('close', function (ws) {
       // for (var key in users) {
      //      console.log('ws ' + ws);
      //      if (key.indexOf(users[name]) != -1) {
      //          key.splice(1, 1);
      //          console.log('delete user ' + key);
      //      }
        //      delete key;
        console.log('delete user ' + myname);
        delete users[myname];
        delete chats[myname];
       // }
        console.log('close connection ' + connections);
        connections = connections - 1;
        try {
            wss.clients.forEach(function each(client) {
                if (client !== ws) {
                    client.send('AUTH DEL_USER {' + myname + '}');
                }
            });
        } catch (err) {
            console.log('error REF  ' + err);
        }
        //delete users[ws.eventNames];
    });
    ws.on('error', function () {
        console.log('error connection ' + connections);
        console.log('delete user ' + myname);
        connections = connections - 1;
        delete users[myname];
        delete chats[myname];
        try {
            wss.clients.forEach(function each(client) {
                if (client !== ws) {
                    client.send('AUTH DEL_USER {' + myname+'}');
                }
            });
        } catch (err) {
            console.log('error REF  ' + err);
        }
        //delete users[name];
    });
    console.log('Connected', ws.url);
});
