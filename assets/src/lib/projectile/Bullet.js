/*global define, canvas, ctx*/

define("Bullet", ["Projectile"], function (Projectile) {
    "use strict";

    Bullet.inherits([Projectile]);

    function Bullet(shooter, x, y, velocity) {
        Projectile.apply(this, [shooter, x, y, velocity, 1, 1, Bullet.INIT_MASS]);

        if (!(this instanceof Bullet)) {
            throw new TypeError("Bullet constructor cannot be called as a function.");
        }
    }

    Bullet.INIT_MASS = 2;

    Bullet.prototype.render = function () {
        ctx.save();

        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(this.getPos().x, this.getPos().y, this.getDimensions().width, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    };

    return Bullet;
});