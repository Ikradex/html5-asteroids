/*global define, projectileHandler*/

define("Cannon", ["Bullet", "Vector2D"], function (Bullet, Vector2D) {
    "use strict";

    function Cannon() {
        if (!(this instanceof Cannon)) {
            throw new TypeError("Cannon constructor cannot be called as a function.");
        }

        this._power = 2500;
        this._cooldown = 0;
    }

    Cannon.prototype = {
        constructor: Cannon,

        update: function (dt) {
            if (this._cooldown > 0) {
                this._cooldown -= 1000 * dt;
            } else {
                this._cooldown = 0;
            }
        },

        fire: function (shooter, x, y, dir, dt) {
            if (this._cooldown <= 0) {
                var bullet = new Bullet(shooter, x, y);
                bullet.propel(this._power, dir, dt);
                projectileHandler.add(bullet);

                this._applyHeat(200);

                // give back the opposing force 
                return dir.scale(-1).scale(this._power);
            } else {
                return new Vector2D(0, 0);
            }
        },

        _applyHeat: function (heat) {
            this._cooldown += heat;
        }
    };

    return Cannon;
});