/*global define, projectileHandler*/

define("Cannon", ["Weapon", "Bullet"], function (Weapon, Bullet) {
    "use strict";

    Cannon.inherits([Weapon]);

    function Cannon() {
        Weapon.apply(this, arguments);

        if (!(this instanceof Cannon)) {
            throw new TypeError("Cannon constructor cannot be called as a function.");
        }

        this._power = 2000;
        this._heatRate = 50;
    }

    Cannon.prototype.update = function (dt) {
        if (this._cooldown > 0) {
            this._cooldown -= 1000 * dt;
        } else {
            this._cooldown = 0;
        }
    };

    Cannon.prototype.fire = function (shooter, x, y, velocity, dir, dt) {
        var bullet = new Bullet(shooter, x, y, velocity),
            force = this._propelProjectile(bullet, dir, dt);

        return force;
    };

    return Cannon;
});