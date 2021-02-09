const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const Client = require('./src/Client.js');
// const GameManager = require('./src/Services/GameManager.js');
// const TargetManager = require('./src/Services/TargetManager.js');

const port = 3000;
const app = express();
const server = http.Server(app);
const serverSocket = new WebSocket.Server({
    server
});

serverSocket.on('connection', (socket) => {
    new Client(socket);
});

app.use(express.static('client'));

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
});
