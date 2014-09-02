/*global define, projectileHandler*/

define("Minigun", ["Weapon", "Bullet"], function (Weapon, Bullet) {
    "use strict";

    Minigun.inherits([Weapon]);

    function Minigun() {
        Weapon.apply(this, arguments);

        if (!(this instanceof Minigun)) {
            throw new TypeError("Minigun constructor cannot be called as a function.");
        }

        this._power = 600;
        this._heatRate = 75;
        this._fireLock = false;
    }

    Minigun.prototype.update = function (dt) {
        if (this._cooldown > 0) {
            this._cooldown -= 1000 * dt;
        } else {
            this._cooldown = 0;
        }
    };

    Minigun.prototype.fire = function (shooter, x, y, velocity, dir, dt) {
        var bullet = new Bullet(shooter, x, y, velocity),
            force = this._propelProjectile(bullet, dir, dt);

        return force;
    };

    return Minigun;
});