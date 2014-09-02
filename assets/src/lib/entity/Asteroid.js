/*global define, canvas, ctx, imgs*/

define("Asteroid", [
    "CollidableEntity",
    "Vector2D",
    "Library"
], function (CollidableEntity, Vector2D, Library) {
    "use strict";

    Asteroid.inherits([CollidableEntity]);

    function Asteroid(x, y, width, height, velocity, stage) {
        CollidableEntity.apply(this, [x, y, width, height, Asteroid.INIT_MASS]); // call super

        if (!(this instanceof Asteroid)) {
            throw new TypeError("Asteroid constructor cannot be called as a function.");
        }

        this._velocity = velocity;
        this._stage = (stage !== "undefined" && stage !== null) ? stage : 0;

        console.debug(imgs);
        this._img = imgs["asteroid_" + Library.randomInteger(1, 5)];
    }

    Asteroid.INIT_MASS = 1000;
    Asteroid.MIN_VELOCITY = 20;
    Asteroid.MAX_VELOCITY = 80;

    Asteroid.DEFAULT_WIDTH = 60;
    Asteroid.DEFAULT_HEIGHT = 60;

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
    Asteroid.prototype.destroy = function (entity) {
        var children = [];

        if (this._stage < Asteroid.MAX_DEATH_SPAWNS) {
            for (var i = 0; i < Asteroid.NUM_CHILD_SPAWNS; i++) {
                // spawn a little off center
                var newX = this._pos.x + Library.randomInteger(-5, 5),
                    newY = this._pos.y + Library.randomInteger(-5, 5);

                var velFactorX = Library.randomDouble(0.8, 1.8),
                    velFactorY = Library.randomDouble(0.8, 1.8);

                var velocity = new Vector2D(this._velocity.x * velFactorX, this._velocity.y * velFactorY);

                /*if (typeof entity !== "undefined" && entity != null) {
                    var postXY = Library.elasticCollisionVelocities(velocity, this._mass, entity.getVelocity(), entity.getMass()),
                        postVel = new Vector2D(postXY.x, postXY.y);

                    // add the collision velocity to the child asteroid
                    velocity = velocity.add(postVel);
                }*/

                var child = new Asteroid(newX, newY, this._width / 2, this._height / 2, velocity, this._stage + 1);
                children.push(child);
            }
        }

        return children;
    };

    return Asteroid;
});