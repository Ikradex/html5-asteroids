/*global define, canvas, ctx*/

define("Projectile", [
    "CollidableEntity",
    "Vector2D",
    "Library"
], function (CollidableEntity, Vector2D, Library) {
    "use strict";

    Projectile.inherits([CollidableEntity]);

    function Projectile(shooter, x, y, velocity, width, height, mass) {
        CollidableEntity.apply(this, [x, y, width, height, mass]);

        if (!(this instanceof Projectile)) {
            throw new TypeError("Projectile constructor cannot be called as a function.");
        }

        this._shooter = shooter;

        this._originPos = new Vector2D(x, y);
        this._velocity = (velocity !== "undefined" || velocity !== null) ? velocity : new Vector2D(0, 0);

        this._distanceTraveled = new Vector2D(0, 0);

        this._active = false;

        this._bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    // Override CollidableEntity.intersects
    Projectile.prototype.intersects = function (collidableEntity) {
        var c = collidableEntity.getBoundingCircle();

        return Library.pointIntersectsCircle(this._pos.x, this._pos.y, c.x, c.y, c.r);
    };

    Projectile.prototype.update = function (dt) {
        this._wrapAroundBounds(this._bounds);

        //console.debug(this._acceleration.toString());
        this._velocity = this._velocity.add(this._acceleration);

        this._pos = this._pos.add(this._velocity);

        this._distanceTraveled = this._distanceTraveled.add(this._velocity);

        this._acceleration.setComponents(0, 0);
    };

    Projectile.prototype.propel = function (force, dir, dt) {
        this._acceleration = new Vector2D(force.x / this._mass, force.y / this._mass);
        this._velocity = this._velocity.add(this._acceleration.scale(dt));

        this._active = true;
        this._acceleration.setComponents(0, 0);
    };

    Projectile.prototype.getShooter = function () {
        return this._shooter;
    };

    Projectile.prototype.setShooter = function (shooter) {
        this._shooter = shooter;
    };

    Projectile.prototype.getDistanceTraveled = function () {
        return this._distanceTraveled.magnitude();
    };

    Projectile.prototype.getMaxDistance = function () {
        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        var distance = center.distanceTo(corner);

        return distance * 0.75;
    };

    return Projectile;
});