/*global define*/

define("Cannon", [
    "Vector2D",
    "Weapon",
    "Bullet"
], function (Vector2D, Weapon, Bullet) {
    "use strict";

    Cannon.inherits([Weapon]);

    function Cannon(x, y) {
        Weapon.apply(this, [x, y]);

        if (!(this instanceof Cannon)) {
            throw new TypeError("Cannon constructor cannot be called as a function.");
        }

        this._power = 850;
        //this._heatRate = 50;

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this.setProjectileMaxTravelDistance(center.distanceTo(corner) * 0.75);
    }

    Cannon.prototype.fire = function (shooter, velocity, dir, dt) {
        var force = new Vector2D(0, 0);

        if (this._heat < this._maxHeat) {
            var bullet = new Bullet(shooter, this.getPos().x, this.getPos().y, velocity);
            bullet.setMaxTravelDistance(this.getProjectileMaxTravelDistance());

            force = this._propelProjectile(bullet, dir, dt);
        }

        return force;
    };

    return Cannon;
});