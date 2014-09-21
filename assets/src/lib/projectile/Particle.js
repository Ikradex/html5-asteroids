/*global define, canvas, ctx*/

define("Particle", [
    "Entity",
    "Vector2D"
], function (Entity, Vector2D) {
    "use strict";

    Particle.inherits([Entity]);

    function Particle(x, y, wh, mass) {
        Entity.apply(this, [x, y, wh, wh, mass, 0]);

        if (!(this instanceof Particle)) {
            throw new TypeError("Particle constructor cannot be called as a function.");
        }

        this._destroyed = false;

        this._travelDistance = new Vector2D(0, 0);

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this._maxTravelDistance = center.distanceTo(corner) * 0.35;
    }

    Particle.prototype.update = function (dt) {
        if (this._travelDistance.magnitude() < this._maxTravelDistance) {
            this._updatePosition(dt);
            this._travelDistance = this._travelDistance.add(this.getVelocity().scale(dt));
        } else {
            this._destroyed = true;
        }
    };

    Particle.prototype.render = function () {
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.fillRect(this.getPos().x, this.getPos().y, this.getDimensions().width, this.getDimensions().height);
        ctx.restore();
    };

    return Particle;
});