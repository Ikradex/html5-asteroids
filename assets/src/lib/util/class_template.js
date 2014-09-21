/*global define, canvas, ctx*/

define("Object", [], function () {
    "use strict";

    function Object() {
        if (!(this instanceof Object)) {
            throw new TypeError("Object constructor cannot be called as a function.");
        }
    }

    Object.prototype = {
        constructor: Object,

        update: function (dt) {

        },

        render: function () {

        }
    };

    return Object;
});