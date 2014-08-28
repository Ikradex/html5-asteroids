/*global define, ctx*/

define("Triangle2D", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Triangle2D(x, y, w, h) {
        if (!(this instanceof Triangle2D)) {
            throw new TypeError("Triangle2D constructor cannot be called as a function.");
        }

        this.width = w;
        this.height = h;

        this._setVectors(x, y, w, h);
    }

    Triangle2D.prototype = {
        constructor: Triangle2D,

        rotate: function (theta, v) {
            this._vTop = this._vTop.rotate(theta, v);
            this._vBRight = this._vBRight.rotate(theta, v);
            this._vBLeft = this._vBLeft.rotate(theta, v);
        },

        center: function () {
            return new Vector2D((this._vBLeft.x + this._vBRight.x + this._vTop.x) / 3, (this._vBLeft.y + this._vBRight.y + this._vTop.y) / 3);
        },

        set: function (v) {
            var translate = v.sub(this.center());
            this._vTop = this._vTop.add(translate);
            this._vBLeft = this._vBLeft.add(translate);
            this._vBRight = this._vBRight.add(translate);
        },

        getTop: function () {
            return this._vTop;
        },

        move: function (v) {
            this._vTop = this._vTop.add(v);
            this._vBLeft = this._vBLeft.add(v);
            this._vBRight = this._vBRight.add(v);
        },

        render: function () {
            ctx.save();

            ctx.beginPath();
            ctx.moveTo(this._vTop.x, this._vTop.y);
            ctx.lineTo(this._vBLeft.x, this._vBLeft.y);
            ctx.moveTo(this._vTop.x, this._vTop.y);
            ctx.lineTo(this._vBRight.x, this._vBRight.y);
            ctx.moveTo(this._vBLeft.x, this._vBLeft.y);
            ctx.lineTo(this._vBRight.x, this._vBRight.y);
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        },

        _setVectors: function (x, y, w, h) {
            this._vTop = new Vector2D(x, y - h / 2);
            this._vBLeft = new Vector2D(x - w / 2, y + h / 2);
            this._vBRight = new Vector2D(x + w / 2, y + h / 2);
        }
    };

    return Triangle2D;
});