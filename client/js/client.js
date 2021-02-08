let stats = {};
let targets = {};

let socket = null;

let newGame = () => {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        let payload = Object.assign({
            width,
            height,
        }, Object.fromEntries(
            Object.values(options).map(option => [option.id, option.value])
        ));

        socket.send(JSON.stringify({
            key: 'options',
            payload,
        }));
    }

    socket.onclose = () => {
        console.log('Connection closed!');
    }

    socket.onerror = () => {
        console.log('Connection error!');
    }

    socket.onmessage = ({data}) => {
        let message = JSON.parse(data);

        switch(message.key) {
            case 'stats':
                stats = message.payload;
                break;
            case 'target.add':
                targets[message.payload.id] = message.payload;
                break;
            case 'target.remove':
                delete targets[message.payload.id];
                break;
            default:
                console.log(message.payload);
                break;
        }
    }
}
