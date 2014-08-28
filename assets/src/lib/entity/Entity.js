/*global define*/

define("Entity", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Entity(x, y, width, height) {
        if (!(this instanceof Entity)) {
            throw new TypeError("Entity constructor cannot be called as a function.");
        }

        this._pos = new Vector2D(x, y);

        if (width !== "undefined" && height !== "undefined") {
            this.dimensions = {
                width: width,
                height: height
            };
        }
    }

    Entity.prototype = {
        constructor: Entity,

        _wrapAroundBounds: function (bounds) {
            var width = (this.dimensions.width !== "undefined") ? this.dimensions.width : 0,
                height = (this.dimensions.height !== "undefined") ? this.dimensions.height : 0;

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
            this._pos = pos;
        }
    };

    return Entity;
});