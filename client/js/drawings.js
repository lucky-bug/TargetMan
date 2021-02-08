function drawCursor(x, y, { size = 16, color = '#ccc' } = {}) {
    push();

    stroke(color);
    fill(color);
    strokeWeight(1.5);
    noStroke();
    circle(x, y, 3);
    stroke(color);
    line(x, y - size, x, y - size / 2);
    line(x + size, y, x + size / 2, y);
    line(x, y + size, x, y + size / 2);
    line(x - size, y, x - size / 2, y);
    noFill();
    circle(x, y, size * 1.5);

    pop();
}

function drawTarget(x, y, radius, { bordered = false, borderColor = '#9e9e9e', colors = ['#f44336', '#fafafa'], totalCircles = 3 } = {}) {
    push();
    noStroke();

    for (let i = totalCircles; i > 0; i--) {
        fill(colors[(totalCircles - i) % colors.length]);
        circle(x, y, i * (2 * radius / totalCircles));
    }

    if (bordered) {
        noFill();
        stroke(borderColor);
        circle(x, y, radius);
    }

    pop();
}

function drawStats({color = '#bbb', fontFamily = 'Press Start'} = {}) {
    push();
    fill(color);
    textFont(fontFamily);
    textSize(10);

    let i = 0;

    for (let stat in stats) {
        text(`${stat}: ${stats[stat]}`, 10, 20 * ++i);
    }

    pop();
}
