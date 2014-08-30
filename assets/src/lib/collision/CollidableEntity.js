/*global define*/

define("CollidableEntity", ["Entity"], function (Entity) {
    "use strict";

    CollidableEntity.inherits([Entity]);

    function CollidableEntity(x, y, width, height, mass) {
        Entity.apply(this, [x, y, width, height]);

        if (!(this instanceof CollidableEntity)) {
            throw new TypeError("CollidableEntity constructor cannot be called as a function.");
        }

        this._mass = mass;
        this._destroyed = false;
    }

    CollidableEntity.prototype.getBoundingCircle = function () {
        return {
            x: this.getPos().x,
            y: this.getPos().y,
            r: this._width / 2
        };
    }

    CollidableEntity.prototype.getMass = function () {
        return this._mass;
    };

    CollidableEntity.prototype.setMass = function (mass) {
        this._mass = mass;
    };

    CollidableEntity.prototype.intersects = function (collidableEntity) {};

    CollidableEntity.prototype.isDestroyed = function () {
        return this._destroyed;
    }

    CollidableEntity.prototype.destroy = function () {
        this._destroyed = true;
    };

    return CollidableEntity;
});