/*global define, canvas, ctx*/

define("Build", [
    "Vector2D",
    "Library",
    "Level",
    "KeyboardState",
    "EntityManager"
], function (Vector2D, Library, Level, KeyboardState, EntityManager) {
    "use strict";

    function Game() {
        if (!(this instanceof Game)) {
            throw new TypeError("Game constructor cannot be called as a function.");
        }

        this.input = new KeyboardState();
        this.entityManager = new EntityManager();

        this._started = false;
        this._paused = false;
    }

    Game.DEFAULT_WIDTH = 650;
    Game.DEFAULT_HEIGHT = 450;

    Game.INIT_LEVEL_NUM = 0;
    Game.PHYSICS_LEVEL = 0.5;
    Game.GRAV_CONST = 1;
    Game.DEBUG = true;
    Game.FPS = 80;

    Game.prototype = {
        /**
         * Whenever you replace an Object's Prototype, you need to repoint
         * the base Constructor back at the original constructor Function,
         * otherwise `instanceof` calls will fail.
         */
        constructor: Game,

        getUserInput: function (dt) {
            this.entityManager.processInput(dt);
        },

        getConsts: function () {
            return {
                DEFAULT_WIDTH: Game.DEFAULT_WIDTH,
                DEFAULT_HEIGHT: Game.DEFAULT_HEIGHT,
                GRAV_CONST: Game.GRAV_CONST,
                PHYSICS_LEVEL: Game.PHYSICS_LEVEL,
            }
        },

        update: function (dt) {
            this.entityManager.update(dt);
        },

        render: function () {
            ctx.save();
            ctx.font = "12px AtariChunky";
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // render level, debug etc
            this.entityManager.render();

            if (Game.DEBUG) {
                ctx.font = "9px Monospace";
                ctx.fillStyle = "#FFF";
                ctx.fillText("Players: " + this.entityManager.getPlayers().length, canvas.width - 100, 20);
                ctx.fillText("Asteroids: " + this.entityManager.getAsteroids().length, canvas.width - 100, 40);
                ctx.fillText("Enemies: " + this.entityManager.getEnemies().length, canvas.width - 100, 60);
                ctx.fillText("Projectiles: " + this.entityManager.getProjectiles().length, canvas.width - 100, 80);
            }
            ctx.restore();
        },

        start: function () {
            this._started = true;
            this._paused = false;

            this._currentLevel = new Level(Game.INIT_LEVEL_NUM);

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