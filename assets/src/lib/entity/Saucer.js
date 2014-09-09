/*global define, canvas, ctx*/

define("Saucer", [
    "Library",
    "Vector2D",
    "EventTimer",
    "Enemy",
    "Cannon"
], function (Library, Vector2D, EventTimer, Enemy, Cannon) {
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

        this._enginePower = 900;

        this._fireTimer = new EventTimer(this._getFireInterval(), function () {
            this.shoot(this._dt);
            this._fireTimer.setWaitTime(this._getFireInterval());
        }.bind(this));

        this._shiftYTimer = new EventTimer(this._getShiftYInterval(), function () {
            this._shiftY();
            this._shiftYTimer.setWaitTime(this._getShiftYInterval());
        }.bind(this));
    }

    Saucer.INIT_MASS = 400;
    Saucer.X_VELOCITY = 75;
    Saucer.MIN_BEHAVIOR_INTERVAL = 500;
    Saucer.MAX_BEHAVIOR_INTERVAL = 2000;

    Saucer.prototype.update = function (dt) {
        this._fireTimer.wait(dt);
        this._shiftYTimer.wait(dt);
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

    Saucer.prototype._shiftY = function () {
        var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL,
            yAng = 90 * Library.randomBoolean() ? 1 : -1,
            dir = new Vector2D(0, -Math.sin(yAng));

        if (PHYSICS_LEVEL < 0) {
            this.applyForce(dir.scale(this._enginePower * 10));
        } else {
            var yVel = 200 * Library.randomBoolean() ? 1 : -1;
            this.getVelocity().y = yVel;
        }
        console.debug(this.getVelocity());
    };

    Saucer.prototype._getFireInterval = function () {
        return this._randomBehaviorInterval();
    };

    Saucer.prototype._getShiftYInterval = function () {
        return this._randomBehaviorInterval();
    };

    Saucer.prototype._randomBehaviorInterval = function () {
        return Library.randomInteger(Saucer.MIN_BEHAVIOR_INTERVAL, Saucer.MAX_BEHAVIOR_INTERVAL);
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