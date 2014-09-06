/*global define, canvas, ctx, game*/

define("Player", [
    "CollidableEntity",
    "Cannon",
    "Vector2D",
    "Triangle2D"
], function (CollidableEntity, Cannon, Vector2D, Triangle2D) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, [x, y, width, height, Player.INIT_MASS, Player.SCORE_VALUE]); // call super

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this.lives = 3;

        this._weapon = new Cannon();
        this._fireLock = false;

        this._enginePower = 700;

        this._sprite = new Triangle2D(this._pos.x, this._pos.y, width, height);
    }

    Player.INIT_MASS = 300;
    Player.SCORE_VALUE = 1000;
    Player.MAX_LIVES = 4;

    /* Public */

    Player.prototype.update = function (dt) {
        if (!this.getDestroyed()) {
            this._updatePosition(dt);
            this._weapon.update(dt);
        } else {
            // wait
            if (game.entityManager.isRespawnClear()) {
                this._respawn();
            }
        }
    };

    Player.prototype.render = function () {
        if (!this.getDestroyed()) {
            this._sprite.render();
        }
    };

    Player.prototype.processInput = function (dt) {
        var input = game.input;

        if (input.pressed("A") || input.pressed("left")) {
            this.rotate(this._compute_dTheta(-1, dt));
        }

        if (input.pressed("D") || input.pressed("right")) {
            this.rotate(this._compute_dTheta(1, dt));
        }

        if (input.pressed("W") || input.pressed("up")) {
            this.thrust();
        }

        if (input.pressed("space")) {
            if (!this._weapon.getFireLock() || !this._fireLock) {
                this.shoot(dt);
                this._fireLock = !this._fireLock;
            }
        } else {
            this._fireLock = false;
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

        this._sprite.rotate(theta, this.getPos());
    };

    Player.prototype.thrust = function () {
        var thrustForce = this._dir.scale(this._enginePower);
        this.applyForce(thrustForce);
    };

    Player.prototype.shoot = function (dt) {
        var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL;

        var velocity = this._velocity.clone(),
            dir = this._dir.clone();

        var opposingForce = this._weapon.fire(this, this._sprite.getTop().x, this._sprite.getTop().y, velocity, dir, dt);

        if (PHYSICS_LEVEL > 0) {
            this.applyForce(opposingForce.scale(PHYSICS_LEVEL));
        }
    };

    // Override Entity.setPos
    Player.prototype.setPos = function (pos) {
        this._pos = pos;
        this._sprite.set(pos);
    };

    // Override Entity.getPos
    Player.prototype.getPos = function () {
        return this._sprite.center();
    };

    /* Private */

    Player.prototype._updatePosition = function (dt) {
        this._pos = this._pos.add(this._velocity);
        this._sprite.move(this._velocity);

        this._velocity = this._velocity.add(this._compute_dVelocity(this._acceleration, dt));

        // add friction (I know, I know, space, but game-mechanics)
        this._velocity = this._velocity.scale(0.99);

        // reset acceleration and forces
        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);

        this._wrapAroundBounds();
    };

    // Override CollidableEntity.destroy
    Player.prototype.destroy = function (entity) {
        this.setDestroyed(true);
    };

    Player.prototype._respawn = function () {
        this.setDestroyed(false);

        this.setPos(new Vector2D(canvas.width / 2, canvas.height / 2));

        this.lives--;
    };

    return Player;
});