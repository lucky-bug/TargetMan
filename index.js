const express = require('express');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const Game = require('./src/Game.js');

const port = 3000;
const app = express();
const server = http.Server(app);
const serverSocket = new WebSocket.Server({
    server
});

const outputFile = 'output.csv';

function saveCSV(obj) {
    let str = '';

    for (let key in obj) {
        str += ',' + obj[key];
    }

    str = str.substr(1);

    fs.appendFile(outputFile, str + '\n', function (err) {
        if (err) throw err;
    });
}

serverSocket.on('connection', (socket) => {
    let game = new Game(socket);
    // console.log('Game Started!');

    socket.onclose = () => {
        console.log(game.stats);

        saveCSV(game.stats);

        // console.log('Game Ended!');

        game.end();

        delete game;
    };
});

app.use(express.static('client'));

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
});
