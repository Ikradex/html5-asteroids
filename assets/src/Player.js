/*global define, canvas, ctx, input, imgs*/

define("Player", [
    "CollidableEntity",
    "Cannon",
    "Vector2D",
    "Triangle2D",
    "Library"
], function (CollidableEntity, Cannon, Vector2D, Triangle2D, Library) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, [x, y, width, height, 100]); // call super

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this._velocity = new Vector2D(0, 0);
        this._acceleration = new Vector2D(0, 0);
        this._forces = new Vector2D(0, 0);

        this._weapon = new Cannon();

        this._enginePower = 350;

        this._dir = new Vector2D(-Math.cos(this._theta), -Math.sin(this._theta));
        this._theta = Math.PI / 2; // in radians
        this._dTheta = 4.975; // in radians

        this._sprite = new Triangle2D(this._pos.x, this._pos.y, width, height);
        this._bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    /* Public */

    Player.prototype.update = function (dt) {
        this._updatePosition(dt);
        this._weapon.update(dt);
        this._wrapAroundBounds(this._bounds);
    };

    Player.prototype.render = function () {
        this._sprite.render();

        /*ctx.beginPath();
        ctx.arc(this._pos.x, this._pos.y, 1, 0, 2 * Math.PI, false);
        ctx.stroke();*/
    };

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
            this.shoot(dt);
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
        var opposingForce = this._weapon.fire(this, this._sprite.getTop().x, this._sprite.getTop().y, this._dir, dt);
        this.applyForce(opposingForce);
    };

    Player.prototype.applyForce = function (force) {
        this._forces = this._forces.add(force);
        this._acceleration = this._acceleration.add(this._compute_dAcceleration(this._forces));
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

    Player.prototype._compute_dTheta = function (dir, dt) {
        return this._dTheta * dir * dt;
    };

    Player.prototype._compute_dForce = function (dir, force) {
        // add XY forces of engine at direction
        return dir.scale(force);
    };

    Player.prototype._compute_dAcceleration = function (force) {
        return new Vector2D(force.x / this._mass, force.y / this._mass); // a = f / m
    };

    Player.prototype._compute_dVelocity = function (acceleration, dt) {
        return acceleration.scale(dt);
    };

    Player.prototype._updatePosition = function (dt) {
        this._pos = this._pos.add(this._velocity);
        this._sprite.move(this._velocity);

        this._velocity = this._velocity.add(this._compute_dVelocity(this._acceleration, dt));

        // add friction (I know, I know, space, but game-mechanics)
        this._velocity = this._velocity.scale(0.99);

        // reset acceleration and forces
        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);
    };

    return Player;
});