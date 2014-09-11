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

        this._enginePower = 2000;

        this._shiftYLength = this._getShiftYLength();

        this._fireTimer = new EventTimer(this._getBehaviorInterval(), function () {
            this.shoot(this._dt);
            this._fireTimer.setWaitTime(this._getBehaviorInterval());
        }.bind(this));

        this._shiftYTimer = new EventTimer(this._getBehaviorInterval(), function () {
            this._shiftY();
            this._shiftYLength = this._getShiftYLength();
        }.bind(this));
    }

    Saucer.X_VELOCITY = 75;
    Saucer.MIN_BEHAVIOR_INTERVAL = 500;
    Saucer.MAX_BEHAVIOR_INTERVAL = 2000;
    Saucer.INIT_MASS = 400;

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

    Saucer.prototype._shiftY = function () {
        var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL,
            ang = 90 * Library.randomBoolean() ? 1 : -1,
            dir = new Vector2D(0, -Math.sin(ang)).scale(10);

        if (PHYSICS_LEVEL > 0) {
            this.applyForce(dir.scale(this._enginePower));
        } else {
            //this._velocity.y = 150 * (Library.randomBoolean() ? 1 : -1);
        }
    };

    Saucer.prototype._getShiftYLength = function () {
        return 100;
    };

    // Override Enemy.shoot
    Saucer.prototype.shoot = function (dt) {
        this._dir = this._aim();
        this._weapon.fire(this, this.getPos().x, this.getPos().y, this.getVelocity(), this._dir, dt);
    };

    Saucer.prototype._getBehaviorInterval = function () {
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