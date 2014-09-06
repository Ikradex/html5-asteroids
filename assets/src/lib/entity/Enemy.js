/*global define, canvas, ctx*/

define("Enemy", [
    "CollidableEntity"
], function (CollidableEntity) {
    "use strict";

    Enemy.inherits([CollidableEntity]);

    function Enemy(x, y, width, height, mass, scoreValue, weapon) {
        CollidableEntity.apply(this, [x, y, width, height, mass, scoreValue]);

        if (!(this instanceof Enemy)) {
            throw new TypeError("Enemy constructor cannot be called as a function.");
        }

        this._weapon = weapon;
    }

    Enemy.prototype.update = function (dt) {

    };

    Enemy.prototype.render = function () {

    };

    return Enemy;
});