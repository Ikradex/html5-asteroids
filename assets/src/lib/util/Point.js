/*global define, canvas, ctx*/

define("Point", ["InvalidArgumentError"], function (InvalidArgumentError) {
    "use strict";

    function Point(x, y) {
        if (!(this instanceof Point)) {
            throw new TypeError("Point constructor cannot be called as a function.");
        }

        if (x === 'undefined' || y === 'undefined') {
            throw new InvalidArgumentError("Invalid number of arguments for constructor Point");
        }

        this._x = x;
        this._y = y;
    }

    Point.prototype = {
        constructor: Point,

        getX: function () {
            return this._x;
        },

        setX: function (x) {
            this._x = x;
        },

        getY: function () {
            return this._y;
        },

        setY: function (y) {
            this._y = y;
        },

        getXY: function () {
            return {
                x: this._x,
                y: this._y
            };
        }
    };

    return Point;
});