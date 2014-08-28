/*global define, canvas, ctx, input, imgs*/

define("Player", [
    "CollidableEntity",
    "Vector2D",
    "Triangle2D",
    "Library"
], function (CollidableEntity, Vector2D, Triangle2D, Library) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, arguments);

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this._velocity = new Vector2D(0, 0);
        this._acceleration = new Vector2D(0, 0);

        this._forces = new Vector2D(0, 0);
        this._mass = 100;
        this._engineThrust = 350;

        this._theta = Math.PI / 2; // in radians
        this._dTheta = 4.975; // in radians

        this._dir = new Vector2D(-Math.cos(this._theta), -Math.sin(this._theta));
        this.sprite = new Triangle2D(this._pos.x, this._pos.y, width, height);
    }

    /* Public */

    Player.prototype.update = function (dt) {
        this._updatePosition(dt);

        var bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
        this._wrapAroundBounds(bounds);
    };

    Player.prototype.render = function () {
        this.sprite.render();

        /*ctx.beginPath();
        ctx.arc(this._pos.x, this._pos.y, 1, 0, 2 * Math.PI, false);
        ctx.stroke();*/
    };

    // Override Entity.setPos
    Player.prototype.setPos = function (pos) {
        this._pos = pos;
        this.sprite.set(pos);
    };

    // Override Entity.getPos
    Player.prototype.getPos = function () {
        return this.sprite.center();
    };

    /* Private */

    Player.prototype.processInput = function (dt) {
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
            this.shoot();
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

        this.sprite.rotate(theta, this.getPos());
    };

    Player.prototype.thrust = function () {
        this._forces = this._forces.add(this._compute_dForce(this._dir, this._engineThrust));
        this._acceleration = this._acceleration.add(this._compute_dAcceleration(this._forces));
    };

    Player.prototype._compute_dTheta = function (dir, dt) {
        return this._dTheta * dir * dt;
    };

    Player.prototype._compute_dForce = function (dir, thrust) {
        // add XY forces of engine at direction
        return dir.scale(thrust);
    };

    Player.prototype._compute_dAcceleration = function (force) {
        return new Vector2D(force.x / this._mass, force.y / this._mass); // a = f / m
    };

    Player.prototype._compute_dVelocity = function (acceleration, dt) {
        return acceleration.scale(dt);
    };

    Player.prototype._updatePosition = function (dt) {
        this._pos = this._pos.add(this._velocity);
        this.sprite.move(this._velocity);

        this._velocity = this._velocity.add(this._compute_dVelocity(this._acceleration, dt));

        // add friction (I know, I know, space, but game-mechanics)
        this._velocity = this._velocity.scale(0.99);

        // reset acceleration and forces
        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);
    };

    return Player;
});