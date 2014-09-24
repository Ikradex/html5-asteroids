/*global define, game*/

define("CollidableEntity", [
    "Entity",
    "Vector2D",
    "Library"
], function (Entity, Vector2D, Library) {
    "use strict";

    CollidableEntity.inherits([Entity]);

    function CollidableEntity(x, y, width, height, mass, scoreValue) {
        Entity.apply(this, [x, y, width, height, mass, scoreValue]);

        if (!(this instanceof CollidableEntity)) {
            throw new TypeError("CollidableEntity constructor cannot be called as a function.");
        }

        this._destroyed = false;
    }


    CollidableEntity.prototype.attracts = function (entity) {
        var force = this._getGravityForce(entity);
        this.applyForce(force);
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

    CollidableEntity.prototype.getDestroyed = function () {
        return this._destroyed;
    };

    CollidableEntity.prototype.setDestroyed = function (destroyed) {
        this._destroyed = destroyed;
    };

    CollidableEntity.prototype.destroy = function () {
        this.setDestroyed(true);
    };

    CollidableEntity.prototype._getGravityForce = function (collidableEntity) {
        var angle = this.getPos().angleTo(collidableEntity.getPos()),
            distance = this.getPos().distanceTo(collidableEntity.getPos()),
            dir = new Vector2D(Math.cos(angle), Math.sin(angle));

        var force = Library.forceOfGravity(Game.GRAV_CONST, this.getMass(), collidableEntity.getMass(), distance);

        return dir.scale(force);
    };

    return CollidableEntity;
});