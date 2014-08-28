/*global define, canvas, ctx*/

define("Projectile", ["CollidableEntity", "Vector2D"], function (CollidableEntity, Vector2D) {
    "use strict";

    Projectile.inherits([CollidableEntity]);

    function Projectile(shooter, x, y, width, height, mass) {
        CollidableEntity.apply(this, [x, y, width, height, mass]);

        if (!(this instanceof Projectile)) {
            throw new TypeError("Projectile constructor cannot be called as a function.");
        }

        this._shooter = shooter;

        this._acceleration = new Vector2D(0, 0);
        this._velocity = new Vector2D(0, 0);

        this._active = false;

        this._bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    Projectile.prototype.update = function () {
        this._wrapAroundBounds(this._bounds);
        this._pos = this._pos.add(this._velocity);
    };

    Projectile.prototype.propel = function (force, dir, dt) {
        force = dir.scale(force);

        this._acceleration = new Vector2D(force.x / this._mass, force.y / this._mass);
        this._velocity = this._acceleration.scale(dt);

        this._active = true;
    };

    Projectile.prototype.getShooter = function () {
        return this._shooter;
    };

    Projectile.prototype.setShooter = function (shooter) {
        this._shooter = shooter;
    };

    return Projectile;
});