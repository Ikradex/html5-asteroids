/*global define, canvas, ctx, imgs*/

define("Asteroid", [
    "CollidableEntity",
    "Vector2D",
    "Library"
], function (CollidableEntity, Vector2D, Library) {
    "use strict";

    Asteroid.inherits([CollidableEntity]);

    function Asteroid(x, y, width, height, mass, scoreValue, velocity, stage) {
        CollidableEntity.apply(this, [x, y, width, height, Math.round(mass / stage), scoreValue]); // call super

        if (!(this instanceof Asteroid)) {
            throw new TypeError("Asteroid constructor cannot be called as a function.");
        }

        this._velocity = velocity;
        this._stage = (stage !== "undefined" && stage !== null) ? stage : 0;

        this._img = imgs["asteroid_" + Library.randomInteger(1, 5)];
    }

    Asteroid.MIN_VELOCITY = 20;
    Asteroid.MAX_VELOCITY = 80;

    Asteroid.DEFAULT_WIDTH = 60;
    Asteroid.DEFAULT_HEIGHT = 60;

    Asteroid.NUM_CHILD_SPAWNS = 2;
    Asteroid.MAX_DEATH_SPAWNS = 3;

    Asteroid.prototype.update = function (dt) {
        this._updatePosition(dt);
        this._wrapAroundBounds();
    };

    Asteroid.prototype.render = function () {
        ctx.save();
        ctx.drawImage(this._img, this._pos.x - this._width / 2, this._pos.y - this._height / 2, this._width, this._height);
        ctx.fillStyle = "#FFF";
        ctx.restore();
    };

    Asteroid.prototype._updatePosition = function (dt) {
        this._velocity = this._velocity.add(this._acceleration);

        this._pos = this._pos.add(this._velocity.scale(dt));

        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);
    };

    // Override CollidableEntity.destroy
    Asteroid.prototype.destroy = function (entity) {
        var children = [];

        if (this._stage < Asteroid.MAX_DEATH_SPAWNS) {
            for (var i = 0; i < Asteroid.NUM_CHILD_SPAWNS; i++) {
                // spawn a little off center
                var newX = this._pos.x + Library.randomInteger(-8, 8),
                    newY = this._pos.y + Library.randomInteger(-8, 8);

                var velFactorX = Library.randomDouble(0.8, 2),
                    velFactorY = Library.randomDouble(0.8, 2);

                var velocity = new Vector2D(this._velocity.x * velFactorX, this._velocity.y * velFactorY);

                /*if (typeof entity !== "undefined" && entity != null) {
                    var postXY = Library.elasticCollisionVelocities(velocity, this._mass, entity.getVelocity(), entity.getMass()),
                        postVel = new Vector2D(postXY.x, postXY.y);

                    // add the collision velocity to the child asteroid
                    velocity = velocity.add(postVel);
                }*/

                var child = new Asteroid(newX, newY, this._width / 2, this._height / 2, this.getMass(), this.getScoreValue() * 2, velocity, this._stage + 1);
                children.push(child);
            }
        }

        return children;
    };

    return Asteroid;
});