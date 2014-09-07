/*global define, canvas, ctx*/

define("Saucer", [
        "Library",
        "Vector2D",
        "EventTimer",
        "Enemy",
        "Cannon"
    ],
    function (Library, Vector2D, Enemy, Cannon) {
        "use strict";

        Saucer.inherits([Enemy]);

        function Saucer(x, y, width, height, mass, scoreValue) {
            Enemy.apply(this, [x, y, width, height, mass, scoreValue]);

            if (!(this instanceof Saucer)) {
                throw new TypeError("Saucer constructor cannot be called as a function.");
            }

            var cannon = new Cannon();
            this.setWeapon(cannon);

            var posX = Library.randomBoolean() ? 0 : canvas.width,
                posY = Library.randomBoolean() ? 0 : canvas.height;
            this.setPos(new Vector2D(posX, posY));

            var xVel = Saucer.X_VELOCITY * (Library.randomBoolean() ? 1 : -1);
            this.setVelocity(new Vector2D(xVel, 0));

            this._fireTimer = new EventTimer(this._getFireInterval(), function () {
                this.shoot();
                this._fireTimer.setWaitTime(this._getFireInterval());
            }.bind(this));
        }

        Saucer.X_VELOCITY = 75;
        Saucer.MIN_FIRE_INTERVAL = 500;
        Saucer.MAX_FIRE_INTERVAL = 2000;

        Saucer.prototype.update = function (dt) {
            this._fireTimer.wait(dt);
        };

        Saucer.prototype.render = function () {
            ctx.save();
            ctx.fillStyle = "#F00";
            ctx.beginPath();
            ctx.arc(this.getPos().x, this.getPos().y, this.getDimensions().width, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        };

        Saucer.prototype._getFireInterval = function () {
            return Library.randomInteger(Saucer.MIN_FIRE_INTERVAL, Saucer.MAX_FIRE_INTERVAL);
        };

        return Saucer;
    });