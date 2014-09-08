/*global define, canvas, ctx*/

define("Saucer", [
        "Library",
        "Vector2D",
        "EventTimer",
        "Enemy",
        "Cannon"
    ],
    function (Library, Vector2D, EventTimer, Enemy, Cannon) {
        "use strict";

        Saucer.inherits([Enemy]);

        function Saucer(x, y, width, height, scoreValue) {
            Enemy.apply(this, [x, y, width, height, Saucer.INIT_MASS, scoreValue]);

            if (!(this instanceof Saucer)) {
                throw new TypeError("Saucer constructor cannot be called as a function.");
            }

            this._dt = 0.016; // store the value of dt for automated shooting

            var cannon = new Cannon();
            this.setWeapon(cannon);

            this._fireTimer = new EventTimer(this._getFireInterval(), function () {
                this.shoot(this._dt);
                this._fireTimer.setWaitTime(this._getFireInterval());
            }.bind(this));
        }

        Saucer.X_VELOCITY = 75;
        Saucer.MIN_FIRE_INTERVAL = 500;
        Saucer.MAX_FIRE_INTERVAL = 2000;
        Saucer.INIT_MASS = 400;

        Saucer.prototype.update = function (dt) {
            this._fireTimer.wait(dt);
            this._updatePosition(dt);
            this._weapon.update(dt);

            this._dt = dt;
        };

        Saucer.prototype.render = function () {
            ctx.save();
            ctx.fillStyle = "#F00";
            ctx.beginPath();
            ctx.arc(this.getPos().x, this.getPos().y, this.getDimensions().width / 2, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        };

        // Override Enemy.shoot
        Saucer.prototype.shoot = function (dt) {
            this._dir = this._randomDir();
            this._weapon.fire(this, this.getPos().x, this.getPos().y, this.getVelocity(), this._dir, dt);
        };

        Saucer.prototype._getFireInterval = function () {
            return Library.randomInteger(Saucer.MIN_FIRE_INTERVAL, Saucer.MAX_FIRE_INTERVAL);
        };

        Saucer.prototype._randomDir = function () {
            var randAngle = Library.randomInteger(-180, 180);

            return new Vector2D(-Math.cos(randAngle), -Math.sin(randAngle));
        };

        // Override Entity._handleOutOfBounds
        Saucer.prototype._handleOutOfBounds = function () {
            this.destroy();
        };

        return Saucer;
    });