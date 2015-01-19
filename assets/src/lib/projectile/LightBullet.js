/*global define, canvas, ctx*/

define("LightBullet", ["Projectile"], function (Projectile) {
    "use strict";

    LightBullet.inherits([Projectile]);

    function LightBullet(shooter, x, y, velocity) {
        Projectile.apply(this, [shooter, x, y, velocity, 1, 1, LightBullet.INIT_MASS]);

        if (!(this instanceof LightBullet)) {
            throw new TypeError("LightBullet constructor cannot be called as a function.");
        }
    }

    LightBullet.INIT_MASS = 0.5;

    LightBullet.prototype.render = function () {
        ctx.save();

        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(this.getPos().x, this.getPos().y, this.getDimensions().width, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();

        ctx.restore();
    };

    return LightBullet;
});