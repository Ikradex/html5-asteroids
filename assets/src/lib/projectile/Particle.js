/*global define, canvas, ctx*/

define("Particle", [
    "CollidableEntity",
    "Vector2D"
], function (CollidableEntity, Vector2D) {
    "use strict";

    Particle.inherits([CollidableEntity]);

    function Particle(x, y, wh, mass) {
        CollidableEntity.apply(this, [x, y, wh, wh, mass, 0]);

        if (!(this instanceof Particle)) {
            throw new TypeError("Particle constructor cannot be called as a function.");
        }

        this._travelDistance = new Vector2D(0, 0);

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this._maxTravelDistance = center.distanceTo(corner);
    }

    Particle.prototype.update = function (dt) {
        if (this._travelDistance.magnitude() < this._maxTravelDistance) {
            this._updatePosition(dt);
            this._travelDistance = this._travelDistance.add(this.getVelocity().scale(dt));
        } else {
            this.setDestroyed(true);
        }
    };

    Particle.prototype.render = function () {
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.fillRect(this.getPos().x, this.getPos().y, this.getDimensions().width, this.getDimensions().height);
        ctx.restore();
    };

    // Override CollidableEntity.attracts
    Particle.prototype.attracts = function (entity) {
        var valid = true;

        valid = (entity != this && this.distanceTo(entity) > 1);

        if (valid) {
            var force = this._getGravityForce(entity);
            this.applyForce(force.scale(Game.PHYSICS_LEVEL));
        }
    };

    Particle.prototype.intersects = function (entity) {
        var valid = true;

        valid = (entity != this);

        if (valid) {
            this.setDestroyed(true);
        }
    };

    return Particle;
});