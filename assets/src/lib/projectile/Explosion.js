/*global define, canvas, ctx*/

define("Explosion", [
    "Vector2D"
], function (Vector2D) {
    "use strict";

    function Explosion(x, y) {
        if (!(this instanceof Explosion)) {
            throw new TypeError("Explosion constructor cannot be called as a function.");
        }

        this._pos = new Vector2D(x, y);
        this._radius = 10;

        this._rate = 100;

        this._destroyed = false;
    }

    Explosion.prototype = {
        constructor: Explosion,

        update: function (dt) {
            if (this._radius - this._rate * dt > 0) {
                this._radius -= this._rate * dt;
            } else {
                this._radius = 0;
                this._destroyed = true;
            }
        },

        render: function () {
            ctx.fillStyle = "#FFF";
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.arc(this._pos.x, this._pos.y, this._radius, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }
    };

    return Explosion;
});