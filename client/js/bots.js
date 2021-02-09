let currentBotId = null;
let previousCallback = null;

function botUp(id = 0) {
    if (socket === null) {
        console.error('Socket is not open!');

        return;
    }

    if (currentBotId === null) {
        previousCallback = socket.onmessage;
    }

    switch(id) {
        case 0:
            socket.onmessage = event => {
                let message = JSON.parse(event.data);
                if (message.key === 'targetAdd') {
                    setTimeout(() => {
                        mouseX = message.payload.x;
                        mouseY = message.payload.y;
                        mouseClicked();
                    }, 250);
                }
                previousCallback(event);
            };

            currentBotId = id;

            break;
        default:
            console.error('Unknown bot ID! Enabling default bot!');
            botUp();

            break;
    }
}

function botDown() {
    if (currentBotId !== null) {
        socket.onmessage = event => previousCallback(event);
        currentBotId = null;
    }
}
