/*global define, canvas, ctx*/

define("Enemy", [
    "CollidableEntity",
    "Vector2D",
    "Library"
], function (CollidableEntity, Vector2D, Library) {
    "use strict";

    Enemy.inherits([CollidableEntity]);

    function Enemy(x, y, width, height, mass, scoreValue) {
        CollidableEntity.apply(this, [x, y, width, height, mass, scoreValue]);

        if (!(this instanceof Enemy)) {
            throw new TypeError("Enemy constructor cannot be called as a function.");
        }

        this._accuracy = 0.1;
    }

    Enemy.prototype.update = function (dt) {
        if (!this.getDestroyed()) {
            this._updatePosition(dt);
            this.getWeapon().update(dt);
        }
    };

    Enemy.prototype.getNearestEntity = function (entities) {
        if (entities.length == 1) {
            return entities[0];
        }

        var index = -1,
            max = 0;

        // select closest player
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];

            if (entity.getDestroyed()) {
                continue;
            }

            var distance = this.getPos().distanceTo(entity.getPos());

            if (distance > max) {
                index = i;
                max = distance;
            }
        }

        return (index >= 0) ? entities[index] : null;
    };

    Enemy.prototype.aim = function (entity) {
        var predictedPos, predictedAngle;

        if (typeof entity != "undefined" && entity != null) {
            var relativeVelocity = entity.getVelocity().sub(this.getVelocity().scale(0.5));

            predictedPos = entity.getPos().add(relativeVelocity);
            predictedAngle = this.getPos().angleTo(predictedPos);

            // add inaccuracies
            var inaccuracy = predictedAngle - (predictedAngle * this.getAccuracy());
            predictedAngle += Library.toRadians(Library.randomInteger(-inaccuracy, inaccuracy));
        } else {
            console.debug(entity);
            // default to random aiming if no entity to aim at
            predictedAngle = Library.randomInteger(-180, 180);
        }

        // return the direction the Saucer will need to face
        return new Vector2D(Math.cos(predictedAngle), Math.sin(predictedAngle));
    };

    Enemy.prototype.shoot = function (dt) {
        this.getWeapon().fire(this, this.getPos().x, this.getPos().y, this.getVelocity(), this.getDir(), dt);
    };

    Enemy.prototype.getWeapon = function () {
        return this._weapon;
    };

    Enemy.prototype.getAccuracy = function () {
        return this._accuracy;
    };

    Enemy.prototype.setWeapon = function (weapon) {
        this._weapon = weapon;
    };

    Enemy.prototype.setAccuracy = function (accuracy) {
        this._accuracy = accuracy;
    };

    return Enemy;
});