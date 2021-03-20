const fs = require('fs');

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
            initialTargetTime: 3000,
            fakeTargetChance: 10,
            fakeTargetTime: 250,
            approvalTime: 500,
            levelPoints: 150,
            timeReductionRate: 0.25
        };
        this.stats = {
            running: false,
            lives: 0,
            level: 1,
            points: 0,
            suspicion: 0,
            targetTime: 0,
            missedShots: 0,
            totalTargets: 0,
            totalFakeTargets: 0,
            totalApprovedTargets: 0,
        };
        this.targets = {};
    }

    onMessage({ key, payload }) {
        switch (key) {
            case 'options':
                this.options = payload;
                this.stats.lives = this.options.lives;
                this.stats.targetTime = this.options.initialTargetTime;
                this.stats.running = true;
                this.targetAdd(this.targetRandom());
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

            if (this.stats.suspicion > 1000) {
                this.end();
            }
        }

        this.targetRemove(target.id);
        this.sendStats();
        if (this.stats.running) {
            this.targetAdd(this.targetRandom());
        }
    }

    onShotMissed() {
        this.stats.points -= 45;
        this.stats.missedShots++;
        this.updateLevel();
        this.sendStats();
    }

    onTargetExpired(target) {
        if (target.real) {
            this.stats.lives--;
        }

        if (this.stats.lives === 0) {
            this.end();
        }

        this.targetRemove(target.id);
        this.sendStats();
        if (this.stats.running) {
            this.targetAdd(this.targetRandom());
        }
    }

    updateLevel() {
        let previousLevel = this.stats.level;
        this.stats.level = Math.floor(this.stats.points / this.options.levelPoints) + 1;

        if (this.stats.level > previousLevel) {
            this.stats.targetTime -= this.stats.targetTime * this.options.timeReductionRate;
        } else if (this.stats.level < previousLevel) {
            this.stats.targetTime += this.stats.targetTime * this.options.timeReductionRate / (1 - this.options.timeReductionRate);
        }
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
        let target = {
            id: Math.random(),
            x: Math.round(Math.random() * this.options.width),
            y: Math.round(Math.random() * this.options.height),
            real: Math.random() < 1 / this.options.fakeTargetChance ? false : true,
            radius: this.options.averageTargetSize + (Math.random() * this.options.targetSizeNoise * Math.pow(-1, Math.floor(Math.random() * 2) + 1)),
            approved: false,
        };

        this.stats.totalTargets++;
        this.stats.totalFakeTargets += target.real ? 0 : 1;

        return target;
    }

    targetAdd(target) {
        if (this.stats.running) {
            this.targets[target.id] = target;
            this.send('targetAdd', {
                id: target.id,
                x: target.x,
                y: target.y,
                radius: target.radius,
            });

            setTimeout(() => {
                if (!target.approved) {
                    console.log('Target was not approved!');

                    this.targetRemove(target.id);
                    this.targetAdd(this.targetRandom());
                }
            }, this.options.approvalTime);
        }
    }

    targetApprove(id) {
        if (this.stats.running) {
            let target = this.targets[id];
            let expirationTime = target.real ? this.stats.targetTime : this.options.fakeTargetTime;
            this.stats.totalApprovedTargets++;

            target.approved = true;

            setTimeout(() => {
                if (id in this.targets) {
                    this.onTargetExpired(target);
                }
            }, expirationTime);
        }
    }

    targetRemove(id) {
        if (this.stats.running) {
            delete this.targets[id];
            this.send('targetRemove', id);
        }
    }

    statsToCSV() {
        let outputFile = 'data.csv';
        let str = '';

        for (let key in this.stats) {
            str += ',' + this.stats[key];
        }

        str = str.substr(1);

        fs.appendFile(outputFile, str + '\n', function (err) {
            if (err) throw err;
        });
    }

    sendStats() {
        this.statsToCSV();
        this.send('stats', this.stats);
    }

    send(key, payload) {
        this.socket.send(JSON.stringify({ key, payload }));
    }

    end() {
        this.statsToCSV();
        this.stats.running = false;
        this.sendStats();
    }
}
