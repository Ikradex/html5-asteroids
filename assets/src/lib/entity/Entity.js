/*global define, canvas*/

define("Entity", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Entity(x, y, width, height) {
        if (!(this instanceof Entity)) {
            throw new TypeError("Entity constructor cannot be called as a function.");
        }

        this._pos = new Vector2D(x, y);
        this._velocity = new Vector2D(0, 0);
        this._acceleration = new Vector2D(0, 0);

        if (width !== "undefined" && height !== "undefined") {
            this._width = width;
            this._height = height;
        }

        this._bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    Entity.prototype = {
        constructor: Entity,

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
        },

        _updatePosition: function (dt) {
            this._pos = this._pos.add(this._velocity.scale(dt));
        },

        _wrapAroundBounds: function () {
            var width = (this._width !== "undefined") ? this._width : 0,
                height = (this._height !== "undefined") ? this._height : 0;

            var newPos = this._pos.clone();

            if (newPos.x < this._bounds.x - width) {
                newPos.x = (this._bounds.x + this._bounds.width) + width;
            }

            if (newPos.x > (this._bounds.x + this._bounds.width) + width) {
                newPos.x = this._bounds.x - width;
            }

            if (newPos.y < this._bounds.y - height) {
                newPos.y = (this._bounds.y + this._bounds.height) + height;
            }

            if (newPos.y > (this._bounds.y + this._bounds.height) + height) {
                newPos.y = this._bounds.y - height;
            }

            if (newPos.x != this._pos.x || newPos.y != this._pos.y) {
                this.setPos(newPos);
            }
        }
    };

    return Entity;
});