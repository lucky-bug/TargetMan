# TargetMan

## About

This is a simple 2D target shooting game. It is designed for use in a scientific paper analyses.

## Installation

### Docker (Recommended)

Run the following commands to start container(s) and install dependencies.

```shell
docker-compose up -d --remove-orphans --build
docker-compose exec app yarn
```

Run the following command to start the app.

```shell
docker-compose exec app yarn start
```

### NodeJS

Download and install [Node.js](https://nodejs.org), especially 14.15, because it is the version used during development.

Run the following commands to install dependencies.

```shell
npm install
```

Run the following command to start the app.

```shell
npm start
```

## Play

Visit [http://localhost:3000](http://localhost:3000) to play the game.

You can change game options according to your needs.

## Bots

The game also have bots integrated in it. Currently there is only one, but more comming soon.

Run the following code in browser's developer tools terminal to start the bot.

```js
botUp();
```

Run the following code to stop it.

```js
botDown();
```

## Technologies

Technologies that were used in this project are as follows:

- Client
  - HTML
  - CSS
  - JavaScript
  - Canvas
  - WebSocket
- Server
  - NodeJS
  - ExpressJS
  - WebSocket
- Infrastructure
  - Docker
  - Docker Compose
