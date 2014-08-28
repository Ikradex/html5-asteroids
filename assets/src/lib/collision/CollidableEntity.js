/*global define*/

define("CollidableEntity", ["Entity"], function (Entity) {
    "use strict";

    CollidableEntity.inherits([Entity]);

    function CollidableEntity(x, y, width, height) {
        Entity.apply(this, arguments);

        if (!(this instanceof CollidableEntity)) {
            throw new TypeError("CollidableEntity constructor cannot be called as a function.");
        }


    }

    CollidableEntity.prototype.intersects = function (collidableEntity) {

    };

    CollidableEntity.create = function () {
        var entity = new CollidableEntity();

        return entity;
    }

    return CollidableEntity;
});