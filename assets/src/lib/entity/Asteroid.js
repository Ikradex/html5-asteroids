/*global define, canvas, ctx, imgs*/

define("Asteroid", [
    "CollidableEntity",
    "Vector2D",
    "Library"
], function (CollidableEntity, Vector2D, Library) {
    "use strict";

    Asteroid.inherits([CollidableEntity]);

    function Asteroid(x, y, width, height, velocity, stage) {
        CollidableEntity.apply(this, [x, y, width, height, 1000]); // call super

        if (!(this instanceof Asteroid)) {
            throw new TypeError("Asteroid constructor cannot be called as a function.");
        }

        this._velocity = velocity;
        this._stage = (stage !== "undefined" && stage !== null) ? stage : 0;

        this._img = imgs["asteroid_" + Library.randomInteger(0, imgs.length - 1)];
    }

    Asteroid.NUM_CHILD_SPAWNS = 2;
    Asteroid.MAX_DEATH_SPAWNS = 2;

    Asteroid.prototype.update = function (dt) {
        this._updatePosition(dt);
        this._wrapAroundBounds();
    };

    Asteroid.prototype.render = function () {
        ctx.save();
        ctx.drawImage(this._img, this._pos.x - this._width / 2, this._pos.y - this._height / 2, this._width, this._height);
        ctx.restore();
    };

    // Override CollidableEntity.destroy
    Asteroid.prototype.destroy = function () {
        var children = [];

        if (this._stage < Asteroid.MAX_DEATH_SPAWNS) {
            for (var i = 0; i < Asteroid.NUM_CHILD_SPAWNS; i++) {
                var newX = this._pos.x + Library.randomInteger(-10, 10),
                    newY = this._pos.y + Library.randomInteger(-10, 10);

                var velFactorX = Library.randomDouble(1, 2),
                    velFactorY = Library.randomDouble(1, 2);

                var velocity = new Vector2D(this._velocity.x * velFactorX, this._velocity.y * velFactorY);

                var child = new Asteroid(newX, newY, this._width / 2, this._height / 2, velocity, this._stage + 1);
                children.push(child);
            }
        }

        return children;
    };

    return Asteroid;
});