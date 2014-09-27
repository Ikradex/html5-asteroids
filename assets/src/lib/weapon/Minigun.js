/*global define, projectileHandler*/

define("Minigun", [
    "Weapon",
    "Bullet",
    "Vector2D",
    "Library"
], function (Weapon, Bullet, Vector2D, Library) {
    "use strict";

    Minigun.inherits([Weapon]);

    function Minigun(x, y) {
        Weapon.apply(this, [x, y]);

        if (!(this instanceof Minigun)) {
            throw new TypeError("Minigun constructor cannot be called as a function.");
        }

        this._ammo = 150;

        this._power = 1200;

        this._minHeat = 0;
        this._maxHeat = 5000;
        this._heatRateMod = 2;

        this._coolRate = 100;
        this._fireLock = false;

        this._maxInaccuracy = 45;

        var corner = new Vector2D(0, 0),
            center = new Vector2D(canvas.width / 2, canvas.height / 2);

        this.setProjectileMaxTravelDistance(center.distanceTo(corner) * 0.6);
    }

    Minigun.prototype.fire = function (shooter, velocity, dir, dt) {
        var force = new Vector2D(0, 0);

        if (this._ammo > 0 && this._heat < this._maxHeat) {
            var bullet = new Bullet(shooter, this.getPos().x, this.getPos().y, velocity);
            bullet.setMaxTravelDistance(this.getProjectileMaxTravelDistance());

            var inaccuracy = this._maxInaccuracy * (this._heat / this._maxHeat);
            var newDir = dir.clone();
            newDir.x += Library.toRadians(Library.randomInteger(-inaccuracy, inaccuracy));
            newDir.y += Library.toRadians(Library.randomInteger(-inaccuracy, inaccuracy));

            force = this._propelProjectile(bullet, newDir, dt);

            this._heatRate += this._heatRateMod;

            this._ammo--;
        }

        return force;
    };

    return Minigun;
});