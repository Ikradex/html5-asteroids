/*global define, canvas, ctx*/

define("Enemy", [
    "CollidableEntity"
], function (CollidableEntity) {
    "use strict";

    Enemy.inherits([CollidableEntity]);

    function Enemy(x, y, width, height, mass, scoreValue) {
        CollidableEntity.apply(this, [x, y, width, height, mass, scoreValue]);

        if (!(this instanceof Enemy)) {
            throw new TypeError("Enemy constructor cannot be called as a function.");
        }
    }

    Enemy.prototype.update = function (dt) {
        if (!this.getDestroyed()) {
            this._updatePosition(dt);
            this._weapon.update(dt);
        }
    };

    Enemy.prototype.shoot = function (dt) {
        this._weapon.fire(this, this.getPos().x, this.getPos().y, this.getVelocity(), this._dir, dt);
    };

    Enemy.prototype.getWeapon = function () {
        return this._weapon;
    };

    Enemy.prototype.setWeapon = function (weapon) {
        this._weapon = weapon;
    };

    return Enemy;
});