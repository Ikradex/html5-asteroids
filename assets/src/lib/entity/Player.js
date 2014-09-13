/*global define, canvas, ctx, game*/

define("Player", [
    "EventTimer",
    "CollidableEntity",
    "Cannon",
    "Vector2D",
    "Library"
], function (EventTimer, CollidableEntity, Cannon, Vector2D, Library) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, [x, y, width, height, Player.INIT_MASS, Player.SCORE_VALUE]); // call super

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this.lives = 3;
        this._canRespawn = false;

        this._weapon = new Cannon();
        this._fireLock = false;
        this._enginePower = 400;

        this._respawnTimer = new EventTimer(Player.RESPAWN_INTERVAL, function () {
            this._canRespawn = true;
        }.bind(this));

        this._img = imgs["ship"];
    }

    Player.INIT_MASS = 300;
    Player.SCORE_VALUE = 1000;
    Player.MAX_LIVES = 4;
    Player.RESPAWN_INTERVAL = 3000;

    /* Public */

    Player.prototype.update = function (dt) {
        if (!this.getDestroyed()) {
            this._updatePosition(dt);
            this._weapon.update(dt);
        } else {
            this._respawnTimer.wait(dt);

            if (this._canRespawn && game.entityManager.isRespawnClear()) {
                if (this.lives > 0) {
                    this._respawn();
                } else {
                    // game.over();
                }
            }
        }
    };

    Player.prototype.render = function () {
        if (!this.getDestroyed()) {
            ctx.save();
            ctx.translate(this.getPos().x, this.getPos().y);
            ctx.rotate(this._theta - Math.PI / 2);
            ctx.drawImage(this._img, -(this._width / 2), -(this._height / 2), this.getDimensions().width, this.getDimensions().height);
            ctx.restore();
        }
    };

    Player.prototype._getWeaponPos = function () {
        return Library.pointOnCircumference(this.getPos(), this.getDimensions().width / 2, this._theta - Math.PI);
    };

    Player.prototype.processInput = function (dt) {
        if (!this.getDestroyed()) {
            var input = game.input;

            if (input.pressed("A") || input.pressed("left")) {
                this.rotate(this._compute_dTheta(-1, dt));
            }

            if (input.pressed("D") || input.pressed("right")) {
                this.rotate(this._compute_dTheta(1, dt));
            }

            if (input.pressed("W") || input.pressed("up")) {
                this.thrust();
            } else {
                this._img = imgs["ship"];
            }

            if (input.pressed("space")) {
                if (!this._weapon.getFireLock() || !this._fireLock) {
                    this.shoot(dt);
                    this._fireLock = !this._fireLock;
                }
            } else {
                this._fireLock = false;
            }
        }
    };

    Player.prototype.rotate = function (theta) {
        var resulting_theta = this._theta + theta;

        if (resulting_theta > Math.PI) {
            resulting_theta = -(Math.PI);
        }

        if (resulting_theta < -(Math.PI)) {
            resulting_theta = Math.PI;
        }

        this._theta = resulting_theta;
        this._dir.setComponents(-Math.cos(resulting_theta), -Math.sin(resulting_theta));
    };

    Player.prototype.rotateTo = function (theta) {
        var diff_theta = Math.abs(theta - this._theta);

        diff_theta *= (theta < this._theta) ? 1 : -1;

        this._theta = theta;
        this._dir.setComponents(-Math.cos(theta), -Math.sin(theta));
    };

    Player.prototype.thrust = function () {
        var thrustForce = this._dir.scale(this._enginePower);
        this.applyForce(thrustForce);

        this._img = imgs["ship_motion"];
    };

    Player.prototype.shoot = function (dt) {
        var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL;

        var velocity = this._velocity.clone(),
            dir = this._dir.clone();

        var opposingForce = this._weapon.fire(this, this._getWeaponPos().x, this._getWeaponPos().y, velocity, dir, dt);

        if (PHYSICS_LEVEL > 0) {
            this.applyForce(opposingForce.scale(PHYSICS_LEVEL));
        }
    };

    // Override Entity._updatePosition
    Player.prototype._updatePosition = function (dt) {
        var newPos = this._checkOutOfBounds();

        if (newPos.x != this.getPos().x || newPos.y != this.getPos().y) {
            this._handleOutOfBounds(newPos);
        }

        this._pos = this.getPos().add(this.getVelocity().scale(dt));

        this._velocity = this.getVelocity().add(this._compute_dVelocity(this.getAcceleration(), dt));

        // add friction (I know, I know, space, but game-mechanics)
        this._velocity = this.getVelocity().scale(0.99);

        // reset acceleration and forces
        this.getAcceleration().setComponents(0, 0);
        this.getForces().setComponents(0, 0);
    };

    // Override CollidableEntity.destroy
    Player.prototype.destroy = function (entity) {
        this.setDestroyed(true);
    };

    Player.prototype._respawn = function () {
        var respawnPoint = new Vector2D(canvas.width / 2, canvas.height / 2);

        this.setDestroyed(false);
        this._canRespawn = false;
        this.lives--;

        this.setPos(respawnPoint);
        this._velocity.setComponents(0, 0);
        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);

        this.rotateTo(Math.PI / 2);
    };

    return Player;
});