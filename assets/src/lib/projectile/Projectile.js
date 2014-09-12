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

        this._travelDistance = new Vector2D(0, 0);

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this._maxDistance = center.distanceTo(corner) * 0.75;

        this._active = false;
    }

    // Override CollidableEntity.intersects
    Projectile.prototype.intersects = function (collidableEntity) {
        var c = collidableEntity.getBoundingCircle();

        return Library.pointIntersectsCircle(this._pos.x, this._pos.y, c.x, c.y, c.r);
    };

    Projectile.prototype.update = function (dt) {
        this._updatePosition(dt);
        this._travelDistance = this._travelDistance.add(this.getVelocity().scale(dt));
    };

    Projectile.prototype.propel = function (force, dir, dt) {
        this._acceleration = new Vector2D(force.x / this.getMass(), force.y / this.getMass());
        this._velocity = this.getVelocity().add(this.getAcceleration());

        this._active = true;
        this._acceleration.setComponents(0, 0);
    };

    Projectile.prototype.getShooter = function () {
        return this._shooter;
    };

    Projectile.prototype.setShooter = function (shooter) {
        this._shooter = shooter;
    };

    Projectile.prototype.getTravelDistance = function () {
        return this._travelDistance.magnitude();
    };

    Projectile.prototype.getMaxTravelDistance = function () {
        return this._maxDistance;
    };

    Projectile.prototype.setMaxTravelDistance = function (distance) {
        this._maxDistance = distance;
    };

    return Projectile;
});