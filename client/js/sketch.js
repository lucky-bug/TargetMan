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

        drawCursor(mouseX, mouseY);
        drawStats();
    } else if (menu.classList.contains('hidden')) {
        menu.classList.toggle('hidden');
    }
}
