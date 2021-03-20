const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const Game = require('./src/Game.js');

const port = 3000;
const app = express();
const server = http.Server(app);
const serverSocket = new WebSocket.Server({
    server
});

serverSocket.on('connection', (socket) => {
    let game = new Game(socket);
    // console.log('Game Started!');

    socket.onclose = () => {
        console.log(game.stats);

        // saveCSV(game.stats);

        // console.log('Game Ended!');

        game.end();

        delete game;
    };
});

app.use(express.static('client'));

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
});
