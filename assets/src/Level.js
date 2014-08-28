/*global define, canvas, ctx*/

define(["EventTimer"], function (EventTimer) {
    "use strict";

    function Level(levelNum) {
        if (!(this instanceof Level)) {
            throw new TypeError("Level constructor cannot be called as a function.");
        }

        this._levelNum = levelNum;
    }

    Level.prototype = {
        constructor: Level,

        update: function (dt) {

        },

        render: function () {

        },

        getLevelNum: function () {
            return this._levelNum;
        }
    };

    return Level;
});