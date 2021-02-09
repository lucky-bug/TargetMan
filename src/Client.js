module.exports = class Client {
    constructor(socket) {
        this.socket = socket;
        this.socket.on('message', data => this.onMessage(JSON.parse(data)));
        this.options = {
            width: 400,
            height: 400,
            lives: 3,
            averageTargetSize: 45,
            targetSizeNoise: 10,
            initialTargetTimer: 1500,
            fakeTargetChance: 10,
            fakeTargetTimer: 500,
            approvalTimer: 500,
            perLevelPointsLimit: 150,
            perLevelTimeReduction: 250
        };
        this.stats = {
            running: false,
            lives: 0,
            level: 1,
            points: 0,
            suspicion: 0,
            missedShots: 0,
            totalTargets: 0,
            totalFakeTargets: 0,
            totalApprovedTargets: 0,
        };
        this.targets = {};
    }

    onMessage({ key, payload }) {
        switch(key) {
            case 'options':
                this.options = payload;
                this.stats.lives = this.options.lives;
                this.targetAdd(this.targetRandom());
                this.stats.running = true;
                this.sendStats();
                break;
            case 'mouseClicked':
                this.mouseClicked(payload);
                break;
            case 'targetApprove':
                this.targetApprove(payload);
                break;
            default:
                console.log(key, payload);
                break;
        }
    }

    onShotSucceeded(target, distance) {
        if (target.real) {
            let points = (Math.floor((target.radius - distance) / (target.radius / 3)) + 1) * 5;
            this.stats.points += points;
            this.updateLevel();
        } else {
            this.stats.suspicion += this.stats.suspicion + 1;
        }

        this.targetRemove(target.id);
        this.sendStats();
        if (this.stats.running) {
            this.targetAdd(this.targetRandom());
        }
    }

    onShotMissed() {
        this.stats.points -= 45;
        this.updateLevel();
        this.stats.missedShots++;
        this.sendStats();
    }

    onTargetExpired(target) {
        if (target.real) {
            this.stats.lives--;

            if (this.stats.lives === 0) {
                this.stats.running = false;
            }
        }

        this.targetRemove(target.id);
        this.sendStats();
        if (this.stats.running) {
            this.targetAdd(this.targetRandom());
        }
    }

    updateLevel() {
        this.stats.level = Math.floor(this.stats.points / this.options.perLevelPointsLimit) + 1;
    }

    mouseClicked({ x, y }) {
        let missed = true;

        for (let target of Object.values(this.targets)) {
            if (target.approved) {
                let distance = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));

                if (distance <= target.radius) {
                    this.onShotSucceeded(target, distance);
                    missed = false;

                    break;
                }
            }
        }

        if (missed) {
            this.onShotMissed();
        }
    }

    targetRandom() {
        return {
            id: Math.random(),
            x: Math.random() * this.options.width,
            y: Math.random() * this.options.height,
            real: Math.random() < 1 / this.options.fakeTargetChance ? false : true,
            radius: this.options.averageTargetSize,
            approved: false,
        };
    }

    targetAdd(target) {
        this.targets[target.id] = target;
        this.send('targetAdd', {
            id: target.id,
            x: target.x,
            y: target.y,
            radius: target.radius,
        });
    }

    targetApprove(id) {
        let target = this.targets[id];
        let expirationTime = target.real
            ? this.options.initialTargetTimer - this.stats.level * this.options.perLevelTimeReduction
            : this.options.fakeTargetTimer
        ;
        target.approved = true;

        setTimeout(() => {
            if (id in this.targets) {
                this.onTargetExpired(target);
            }
        }, expirationTime);
    }

    targetRemove(id) {
        delete this.targets[id];
        this.send('targetRemove', id);
    }

    sendStats() {
        this.send('stats', this.stats);
    }

    send(key, payload) {
        this.socket.send(JSON.stringify({key, payload}));
    }

    close() {
        this.socket.close();
    }
}
