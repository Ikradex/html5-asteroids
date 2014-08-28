/*global define canvas*/

define("Entity", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Entity(x, y, width, height) {
        if (!(this instanceof Entity)) {
            throw new TypeError("Entity constructor cannot be called as a function.");
        }

        this._pos = new Vector2D(x, y);

        if (width !== "undefined" && height !== "undefined") {
            this._width = width;
            this._height = height;
        }
    }

    Entity.prototype = {
        constructor: Entity,

        _wrapAroundBounds: function (bounds) {
            var width = (this._width !== "undefined") ? this._width : 0,
                height = (this._height !== "undefined") ? this._height : 0;

            var newPos = this._pos.clone();

            if (newPos.x < bounds.x - width) {
                newPos.x = (bounds.x + bounds.width) + width;
            }

            if (newPos.x > (bounds.x + bounds.width) + width) {
                newPos.x = bounds.x - width;
            }

            if (newPos.y < bounds.y - height) {
                newPos.y = (bounds.y + bounds.height) + height;
            }

            if (newPos.y > (bounds.y + bounds.height) + height) {
                newPos.y = bounds.y - height;
            }

            if (newPos.x != this._pos.x || newPos.y != this._pos.y) {
                this.setPos(newPos);
            }
        },

        getPos: function () {
            return this._pos;
        },

        setPos: function (pos) {
            // Rounding to whole numbers when setting position
            // improves performance when rendering in Integer values
            // as opposed to decimal. Not necessary for this low-graphics
            // game but good habit to remember.
            // Reference: http://jsperf.com/drawimage-whole-pixels
            this._pos = pos;
        },

        getDimensions: function () {
            return {
                width: this._width,
                height: this._height
            };
        },

        setDimensions: function (w, h) {
            this._width = w;
            this._height = h;
        }
    };

    return Entity;
});