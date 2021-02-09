let menu = document.querySelector('.menu');
let canvasHolder = document.querySelector('.canvas-holder');

function setup() {
    let rect = canvasHolder.getBoundingClientRect();
    createCanvas(rect.width, rect.height).parent(canvasHolder);
}

function draw() {
    if (stats.running) {
        if (!menu.classList.contains('hidden')) {
            menu.classList.toggle('hidden');
        }

        clear();

        for (let target of Object.values(targets)) {
            drawTarget(target.x, target.y, target.radius);
        }

        drawStats();
        drawCursor(mouseX, mouseY);
    } else if (menu.classList.contains('hidden')) {
        menu.classList.toggle('hidden');
    }
}

function mouseClicked() {
    if (stats.running) {
        socket.send(JSON.stringify({
            key: 'mouseClicked',
            payload: {
                x: mouseX,
                y: mouseY,
            },
        }));
    }
}

/*
function mouseMoved() {
    socket.send(JSON.stringify({
        key: 'mouseMoved',
        payload: {
            x: mouseX,
            y: mouseY,
        },
    }));
}
*/
