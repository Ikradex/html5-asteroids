/*global define, game*/

define("Weapon", [
    "Vector2D"
], function (Vector2D) {
    "use strict";

    function Weapon(x, y, projectileTravelDistance) {
        if (!(this instanceof Weapon)) {
            throw new TypeError("Weapon constructor cannot be called as a function.");
        }

        this._pos = new Vector2D(x, y);

        this._power = 1000;
        this._cooldown = 0;
        this._heatRate = 75;
        this._fireLock = true;

        this._projectileMaxTravelDistance = (projectileTravelDistance !== null ||
            typeof projectileTravelDistance == "undefined") ?
            projectileTravelDistance : 0;
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

        rotate: function (theta, origin) {
            this.setPos(this.getPos().rotate(theta, origin));
        },

        getPos: function () {
            return this._pos;
        },

        getFireLock: function () {
            return this._fireLock;
        },

        getProjectileMaxTravelDistance: function () {
            return this._projectileMaxTravelDistance;
        },

        setPos: function (pos) {
            this._pos = pos;
        },

        setProjectileMaxTravelDistance: function (distance) {
            this._projectileMaxTravelDistance = distance;
        },

        _propelProjectile: function (projectile, dir, dt) {
            if (this._cooldown > 0) {
                return dir.scale(0);
            }

            var force = dir.scale(this._power);

            projectile.propel(force, dir, dt);
            game.entityManager.add(projectile);

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