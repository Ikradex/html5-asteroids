/*global define, canvas, ctx*/

define("Asteroid", ["Vector2D"], function () {
    "use strict";

    function Asteroid() {
        if (!(this instanceof Asteroid)) {
            throw new TypeError("Asteroid constructor cannot be called as a function.");
        }
    }

    Asteroid.prototype = {
        constructor: Asteroid,

        update: function (dt) {

        },

        render: function () {

        }
    };

    return Asteroid;
});