/*global define*/

define("Cannon", [
    "Vector2D",
    "Weapon",
    "Bullet"
], function (Vector2D, Weapon, Bullet) {
    "use strict";

    Cannon.inherits([Weapon]);

    function Cannon() {
        Weapon.apply(this, arguments);

        if (!(this instanceof Cannon)) {
            throw new TypeError("Cannon constructor cannot be called as a function.");
        }

        this._power = 850;
        this._heatRate = 50;

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this.setProjectileMaxTravelDistance(center.distanceTo(corner) * 0.75);
    }

    Cannon.prototype.update = function (dt) {
        if (this._cooldown > 0) {
            this._cooldown -= 1000 * dt;
        } else {
            this._cooldown = 0;
        }
    };

    Cannon.prototype.fire = function (shooter, x, y, velocity, dir, dt) {
        var bullet = new Bullet(shooter, x, y, velocity);
        bullet.setMaxTravelDistance(this.getProjectileMaxTravelDistance());

        var force = this._propelProjectile(bullet, dir, dt);

        return force;
    };

    return Cannon;
});