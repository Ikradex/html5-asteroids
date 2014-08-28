/*global define, canvas, ctx*/

define("Bullet", ["Projectile"], function (Projectile) {
    "use strict";

    Bullet.inherits([Projectile]);

    function Bullet(shooter, x, y) {
        Projectile.apply(this, [shooter, x, y, 4, 4, 5]);

        if (!(this instanceof Bullet)) {
            throw new TypeError("Bullet constructor cannot be called as a function.");
        }
    }

    Bullet.prototype.render = function () {
        ctx.save();

        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(this._pos.x, this._pos.y, 1, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    };

    return Bullet;
});