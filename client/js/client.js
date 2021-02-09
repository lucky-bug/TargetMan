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
        stats.running = false;
        console.log('Connection closed!');
    }

    socket.onerror = () => {
        stats.running = false;
        console.log('Connection error!');
    }

    socket.onmessage = ({data}) => {
        let message = JSON.parse(data);

        switch(message.key) {
            case 'stats':
                stats = message.payload;
                break;
            case 'targetAdd':
                targets[message.payload.id] = message.payload;
                socket.send(JSON.stringify({
                    key: 'targetApprove',
                    payload: message.payload.id,
                }));
                break;
            case 'targetRemove':
                delete targets[message.payload];
                break;
            default:
                console.log(message.payload);
                break;
        }
    }
}
