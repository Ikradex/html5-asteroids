/*global define, canvas, ctx*/

define("Build", [
    "Vector2D",
    "Library",
    "Level",
    "KeyboardState",
    "EntityManager",
    "ParticleEmitter",
    "EventTimer"
], function (Vector2D, Library, Level, KeyboardState, EntityManager, ParticleEmitter, EventTimer) {
    "use strict";

    function Game() {
        if (!(this instanceof Game)) {
            throw new TypeError("Game constructor cannot be called as a function.");
        }

        this.input = new KeyboardState();

        this.entityManager = new EntityManager();
        this.particleEmitter = new ParticleEmitter();

        this._started = false;
        this._paused = false;

        this._currentLevel = null;

        this.fps = Game.MAX_FPS;
        this._dt = 0.016;

        this._updateFPSTimer = new EventTimer(1000, function () {
            this.fps = Math.round((1000 / this._dt) / 1000);
        }.bind(this));
    }

    Game.DEFAULT_WIDTH = 650;
    Game.DEFAULT_HEIGHT = 450;

    Game.PHYSICS_LEVEL = 0;
    Game.GRAV_CONST = 1;

    Game.PARTICLES = 1;
    Game.SHADOW_BLUR = 0.1;

    Game.INIT_LEVEL_NUM = -1;

    Game.MAX_FPS = 80;

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

        update: function (dt) {
            if (this._currentLevel != null && this._started && !this._paused) {
                this._currentLevel.update(dt);
            }

            this._dt = dt;
            this._updateFPSTimer.wait(dt);
        },

        render: function () {
            ctx.save();
            ctx.font = "16px AtariChunky";
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = ctx.strokeStyle = "#FFF";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // render level, debug etc
            this._currentLevel.render();

            var players = this.entityManager.getPlayers(),
                scoreX = 20;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                ctx.fillText(player.getScore(), scoreX, 20);
                scoreX += 20;

                var livesX = 15;
                for (var j = 0; j < player.lives; j++) {
                    ctx.drawImage(imgs["ship"], livesX, 40, 15, 25);
                    livesX += 15;
                }
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