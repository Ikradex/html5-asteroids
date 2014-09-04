/*global define, game*/

define("CollidableEntity", [
    "Entity",
    "Vector2D",
    "Library"
], function (Entity, Vector2D, Library) {
    "use strict";

    CollidableEntity.inherits([Entity]);

    function CollidableEntity(x, y, width, height, mass) {
        Entity.apply(this, [x, y, width, height, mass]);

        if (!(this instanceof CollidableEntity)) {
            throw new TypeError("CollidableEntity constructor cannot be called as a function.");
        }

        this._destroyed = false;
    }

    CollidableEntity.prototype.getGravityForce = function (collidableEntity) {
        var angle = this.getPos().angleTo(collidableEntity.getPos()),
            distance = this.getPos().distanceTo(collidableEntity.getPos()),
            dir = new Vector2D(Math.cos(angle), Math.sin(angle));

        var force = 0;

        if (distance <= 400) {
            force = Library.forceOfGravity(game.getConsts().GRAV_CONST, this.getMass(), collidableEntity.getMass(), distance);
        }

        return dir.scale(force);
    };

    CollidableEntity.prototype.getBoundingCircle = function () {
        return {
            x: this.getPos().x,
            y: this.getPos().y,
            r: this.getDimensions().width / 2
        };
    };

    CollidableEntity.prototype.intersects = function (collidableEntity) {
        var c1 = this.getBoundingCircle(),
            c2 = collidableEntity.getBoundingCircle();

        return Library.circlesIntersect(c1.x, c1.y, c1.r, c2.x, c2.y, c2.r);
    };

    CollidableEntity.prototype.isDestroyed = function () {
        return this._destroyed;
    }

    CollidableEntity.prototype.destroy = function () {
        this._destroyed = true;
    };

    return CollidableEntity;
});