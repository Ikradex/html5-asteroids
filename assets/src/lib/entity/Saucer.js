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

        var cannon = new Cannon(x, y);
        cannon.setProjectileMaxTravelDistance(Saucer.BULLET_TRAVEL_DISTANCE);
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
            this._shiftYTimer.setWaitTime(this._getBehaviorInterval());
        }.bind(this));

        this._img = imgs["saucer"];
    }

    Saucer.X_VELOCITY = 75;
    Saucer.INIT_MASS = 400;
    Saucer.MIN_BEHAVIOR_INTERVAL = 500;
    Saucer.MAX_BEHAVIOR_INTERVAL = 2000;
    Saucer.BULLET_TRAVEL_DISTANCE = canvas.width / 4;

    Saucer.prototype.update = function (dt) {
        this._fireTimer.wait(dt);
        this._shiftYTimer.wait(dt);
        this._updatePosition(dt);
        this._weapon.update(dt);

        this._dt = dt;
    };

    Saucer.prototype.render = function () {
        ctx.save();
        ctx.drawImage(this._img, this.getPos().x - this.getDimensions().width / 2, this.getPos().y - this.getDimensions().height / 2, this.getDimensions().width, this.getDimensions().height);
        ctx.restore();
    };

    Saucer.prototype.destroy = function (entity) {
        var valid = true;

        if (game.entityManager.isProjectile(entity)) {
            valid = (entity.getShooter() != this);
        }

        if (game.entityManager.isPlayer(entity)) {
            valid = false;
        }

        if (valid) {
            this.setDestroyed(true);

            if (entity) {
                // emit particles
                for (var i = 0; i < Library.randomInteger(3, 8) * Game.PARTICLES; i++) {
                    var ang = Library.randomInteger(-180, 180),
                        dir = new Vector2D(Math.cos(ang), Math.sin(ang));

                    var wh = Library.randomInteger(1, 2) / (Saucer.INIT_MASS / this.getMass()),
                        mass = Library.randomDouble(2, 8) / (Saucer.INIT_MASS / this.getMass()),
                        force = dir.scale(200);

                    game.particleEmitter.emit(entity.getPos().x, entity.getPos().y, wh, mass, force);
                    game.particleEmitter.explode(entity.getPos().x, entity.getPos().y);
                }
            }

            game.entityManager.removeEnemy(this);
        }
    };

    Saucer.prototype._shiftY = function () {
        var PHYSICS_LEVEL = Game.PHYSICS_LEVEL,
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
        this.setDir(this.aim());
        this.getWeapon().fire(this, this.getVelocity(), this.getDir(), dt);
    };

    Saucer.prototype._getBehaviorInterval = function () {
        return Library.randomInteger(Saucer.MIN_BEHAVIOR_INTERVAL, Saucer.MAX_BEHAVIOR_INTERVAL);
    };

    Saucer.prototype._randomDir = function () {
        var randAngle = Library.randomInteger(-180, 180);
        return new Vector2D(-Math.cos(randAngle), -Math.sin(randAngle));
    };

    // Override Entity._handleOutOfBounds
    Saucer.prototype._handleOutOfBounds = function (correctedPos) {
        if (correctedPos.x != this.getPos().x) {
            this.destroy();
        } else if (correctedPos.y != this.getPos.y) {
            this.setPos(correctedPos);
        }
    };

    Saucer.prototype.attracts = function (entity) {
        var valid = true;

        if (game.entityManager.isProjectile) {
            valid = (entity.getShooter() != this);
        }

        valid = (!game.entityManager.isEnemy(entity));

        if (valid) {
            var force = this._getGravityForce(entity);

            this.applyForce(force.scale(Game.PHYSICS_LEVEL));
        }
    };

    Saucer.prototype.toString = function () {
        return "Saucer (" + this.getPos().x + ", " + this.getPos().y + ")";
    };

    return Saucer;
});