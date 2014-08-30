/*global define, entityManager*/

define("Weapon", [], function () {
    "use strict";

    function Weapon() {
        if (!(this instanceof Weapon)) {
            throw new TypeError("Weapon constructor cannot be called as a function.");
        }

        this._power = 1000;
        this._cooldown = 0;
        this._heatRate = 75;
    }

    Weapon.prototype = {
        constructor: Weapon,

        update: function (dt) {
            if (this._cooldown > 0) {
                this._cooldown -= 1000 * dt;
            } else {
                this._cooldown = 0;
            }
        },

        _propelProjectile: function (projectile, dir, dt) {
            if (this._cooldown > 0) {
                return dir.scale(0);
            }

            var force = dir.scale(this._power);

            projectile.propel(force, dir, dt);
            entityManager.addProjectile(projectile);

            this._applyHeat(this._heatRate);

            // give back the opposing force 
            return dir.scale(-1).scale(this._power);
        },

        _applyHeat: function (heat) {
            this._cooldown += heat;
        }
    };

    return Weapon;
});