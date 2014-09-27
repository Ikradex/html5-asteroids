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

        this._ammo = Infinity;

        this._minHeat = 0;
        this._maxHeat = 100;
        this._heat = this._minHeat;

        this._minHeatRate = 5;
        this._maxHeatRate = 50;
        this._heatRate = this._minHeatRate;
        this._heatRateMod = 1;

        this._coolRate = 1000;

        this._fireLock = true;
        this._maxInaccuracy = 20;

        this._projectileMaxTravelDistance = (projectileTravelDistance !== null ||
            typeof projectileTravelDistance == "undefined") ?
            projectileTravelDistance : 0;
    }

    Weapon.prototype = {
        constructor: Weapon,

        update: function (dt) {
            if (this._heat > this._minHeat) {
                this._heat -= this._coolRate * dt;

                if (this._heatRate > 0) {
                    this._heatRate -= 0.5;
                } else {
                    this._heatRate = 0;
                }
            } else {
                this._heat = this._minHeat;
                this._heatRate = this._minHeatRate;
            }
        },

        render: function () {
            var offset = 25;

            ctx.save();
            ctx.strokeStyle = ctx.fillStyle = "#FFF";
            //ctx.strokeRect(this.getPos().x + offset, this.getPos().y - offset, 40, 10);
            //ctx.fillRect(this.getPos().x + offset, this.getPos().y - offset, 40 * (this._heat / this._maxHeat), 10);
            if (this._ammo < Infinity) {
                ctx.fillText(this._ammo, this.getPos().x + offset, this.getPos().y - offset);
            }
            ctx.restore();
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
            var force = dir.scale(this._power);

            projectile.propel(force, dir, dt);
            game.entityManager.add(projectile);

            this._applyHeat(this._heatRate);

            // give back the opposing force 
            return dir.scale(-1).scale(this._power);
        },

        _applyHeat: function (heat) {
            this._heat += heat;
        }
    };

    return Weapon;
});