/*global define, entityManager, canvas, ctx, input*/

define("Build", [
    "Vector2D",
    "Library",
    "Player",
    "Asteroid",
    "KeyboardState",
    "EntityManager"
], function (Vector2D, Library, Player, Asteroid, KeyboardState, EntityManager) {
    "use strict";

    function Game() {
        if (!(this instanceof Game)) {
            throw new TypeError("Game constructor cannot be called as a function.");
        }

        window.PHYSICS_LEVEL = 0.5;

        window.input = new KeyboardState();
        window.entityManager = new EntityManager();

        this._started = false;
        this._paused = false;

        var player = new Player(canvas.width / 2, canvas.height / 2, 14, 24);

        var randXY = Library.randomXY(20, 20, true);
        var randVel = new Vector2D(randXY.x, randXY.y);

        var asteroid = new Asteroid(Library.randomInteger(0, canvas.width), Library.randomInteger(0, canvas.height), 60, 60, randVel, 0);

        entityManager.addPlayer(player);
        entityManager.addAsteroid(asteroid);
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
            entityManager.processInput(dt);
        },

        update: function (dt) {
            entityManager.update(dt);
        },

        render: function () {
            ctx.save();
            ctx.font = "12px AtariChunky";
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // render level, debug etc
            entityManager.render();
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