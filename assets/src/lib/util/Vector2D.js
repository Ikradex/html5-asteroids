/*global define*/

define("Vector2D", [], function () {
    "use strict";

    /**
     * Simple 2D Vector class
     *
     * @param {Double} x the x component
     * @param {Double} y the y component
     */
    function Vector2D(x, y) {
        if (!(this instanceof Vector2D)) {
            throw new TypeError("Vector2D constructor cannot be called as a function.");
        }

        this.x = x;
        this.y = y;
    }

    Vector2D.cross = function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    };

    Vector2D.prototype = {
        constructor: Vector2D,

        add: function (v) {
            return new Vector2D(this.x + v.x, this.y + v.y);
        },

        sub: function (v) {
            return new Vector2D(this.x - v.x, this.y - v.y);
        },

        multiply: function (v) {
            return new Vector2D(this.x * v.x, this.y * v.y);
        },

        scale: function (factor) {
            return new Vector2D(this.x * factor, this.y * factor);
        },

        normalize: function () {
            var v = new Vector2D(0, 0),
                len = this.magnitude();

            if (len !== 0) {
                v.x = this.x / len;
                v.y = this.y / len;
            }

            return v;
        },

        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        },

        cross: function (v) {
            return this.x * v.y - this.y * v.x;
        },

        rotate: function (theta, v) {
            var cs = Math.cos(theta),
                sn = Math.sin(theta);

            var x = this.x - v.x,
                y = this.y - v.y;

            var x_prime = (x * cs) - (y * sn) + v.x,
                y_prime = (x * sn) + (y * cs) + v.y;

            return new Vector2D(x_prime, y_prime);
        },

        angleTo: function (v) {
            return Math.atan2(v.y - this.y, v.x - this.x);
        },

        angleBetween: function (v) {
            return Math.atan2(this.y, this.x) - Math.atan2(v.y, v.x);
        },

        magnitude: function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        },

        distanceTo: function (v) {
            var xd = v.x - this.x,
                yd = v.y - this.y;

            return Math.abs(Math.sqrt(xd * xd + yd * yd));
        },

        setComponents: function (x, y) {
            this.x = x;
            this.y = y;
        },

        round: function () {
            return new Vector2D(Math.round(this.x), Math.round(this.y));
        },

        clone: function () {
            return new Vector2D(this.x, this.y);
        },

        toString: function () {
            return "(" + this.x + ", " + this.y + ")";
        }
    };

    return Vector2D;
});