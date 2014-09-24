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
    };

    Asteroid.prototype.render = function () {
        ctx.save();
        ctx.drawImage(this._img, this._pos.x - this._width / 2, this._pos.y - this._height / 2, this._width * scaleW, this._height * scaleH);
        ctx.restore();
    };

    // Override CollidableEntity.attracts
    Asteroid.prototype.attracts = function (entity) {
        var valid = true;

        valid = (!game.entityManager.isAsteroid(entity));

        if (valid) {
            var force = this._getGravityForce(entity);

            this.applyForce(force);
        }
    };

    // Override CollidableEntity.destroy
    Asteroid.prototype.destroy = function (entity) {
        if (!game.entityManager.isAsteroid(entity)) {
            this.setDestroyed(true);

            if (this._stage < Asteroid.MAX_DEATH_SPAWNS) {
                for (var i = 0; i < Asteroid.NUM_CHILD_SPAWNS; i++) {
                    // spawn a little off center
                    var newX = this._pos.x + Library.randomInteger(-8, 8),
                        newY = this._pos.y + Library.randomInteger(-8, 8);

                    var velFactorX = Library.randomDouble(0.8, 2),
                        velFactorY = Library.randomDouble(0.8, 2);

                    var velocity = new Vector2D(this._velocity.x * velFactorX, this._velocity.y * velFactorY),
                        child = new Asteroid(newX, newY, this._width / 2, this._height / 2, this.getMass(), this.getScoreValue() * 2, velocity, this._stage + 1);

                    game.entityManager.addAsteroid(child);
                }
            }

            // emit particles
            for (var i = 0; i < Library.randomInteger(3, 8) * Game.PARTICLES; i++) {
                var ang = Library.randomInteger(-180, 180),
                    dir = new Vector2D(Math.cos(ang), Math.sin(ang));

                if (Game.PHYSICS_LEVEL > 0 && this._stage < 3) {
                    ang = this.getPos().angleTo(entity.getPos()) + Library.toRadians(Library.randomInteger(-10, 10));
                    dir = new Vector2D(Math.cos(ang), Math.sin(ang));
                }

                var wh = Library.randomInteger(1, 3) / this._stage,
                    mass = Library.randomDouble(5, 10) / this._stage,
                    force = dir.scale(Library.randomInteger(250, 350));

                game.particleEmitter.emit(entity.getPos().x, entity.getPos().y, wh, mass, force);
                game.particleEmitter.explode(entity.getPos().x, entity.getPos().y);
            }

            game.entityManager.removeAsteroid(this);
        }
    };

    Asteroid.prototype.toString = function () {
        return "Asteroid (" + this.getPos().x + ", " + this.getPos().y + ")";
    };

    return Asteroid;
});