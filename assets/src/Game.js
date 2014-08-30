/*global define, projectileHandler, canvas, ctx, input*/

define("Build", ["Player", "KeyboardState", "ProjectileHandler"], function (Player, KeyboardState, ProjectileHandler) {
    "use strict";

    function Game() {
        if (!(this instanceof Game)) {
            throw new TypeError("Game constructor cannot be called as a function.");
        }

        window.input = new KeyboardState();
        window.projectileHandler = new ProjectileHandler();

        window.PHYSICS_LEVEL = 0.5;

        this._started = false;
        this._paused = false;

        this.player = new Player(canvas.width / 2, canvas.height / 2, 14, 24);
    }

    Game.FPS = 80;

    Game.prototype = {
        /**
         * Whenever you replace an Object's Prototype, you need to repoint
         * the base Constructor back at the original constructor Function,
         * otherwise `instanceof` calls will fail.
         */
        constructor: Game,

        getUserInput: function (dt) {
            this.player.processInput(dt);
        },

        update: function (dt) {
            this.player.update(dt);
            projectileHandler.update(dt);
        },

        render: function () {
            ctx.save();
            ctx.font = "12px AtariChunky";
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // render level, debug etc
            projectileHandler.render();
            this.player.render();
            ctx.restore();
        },

        start: function () {
            this._started = true;
            this._paused = false;

            console.info("Game started");
        },

        stop: function () {
            this._started = false;
            this._paused = false;
        },

        pause: function () {
            this._paused = true;
        },

        unpause: function () {
            this._paused = false;
        },

        isStarted: function () {
            return this._started;
        }
    };

    //return a reference to the constructor function.
    return Game;
});