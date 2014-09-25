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
        this._over = false;

        this._currentLevel = null;

        this.speed = 1;

        this.fps = Game.MAX_FPS;
        this._dt = 0.016;

        this._updateFPSTimer = new EventTimer(1000, function () {
            this.fps = Math.round((1000 / this._dt) / 1000);
        }.bind(this));

        this._nextLevelTimer = new EventTimer(Game.LEVEL_RESET_INTERVAL, function () {
            this.nextLevel();
        }.bind(this));
    }

    Game.DEFAULT_WIDTH = 650;
    Game.DEFAULT_HEIGHT = 450;

    Game.PHYSICS_LEVEL = 1;
    Game.GRAV_CONST = 1;
    Game.GRAV_MIN_DISTANCE = 200;

    Game.PARTICLES = 1;
    Game.SHADOW_BLUR = 0.1;

    Game.INIT_LEVEL_NUM = -1;
    Game.LEVEL_RESET_INTERVAL = 3000;

    Game.MAX_FPS = 65;

    Game.prototype = {
        /**
         * Whenever you replace an Object's Prototype, you need to repoint
         * the base Constructor back at the original constructor Function,
         * otherwise `instanceof` calls will fail.
         */
        constructor: Game,

        getUserInput: function () {
            this.entityManager.processInput(this._dt);
        },

        update: function (dt) {
            this._dt = dt * this.speed;

            if (this._currentLevel != null && this._started && !this._paused) {
                if (!this.isOver() && this._currentLevel.isOver()) {
                    this._nextLevelTimer.wait(dt);
                }

                this._currentLevel.update(this._dt);
            }

            this._updateFPSTimer.wait(this._dt);
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

            if (game.isOver()) {
                var text = "GAME OVER";
                ctx.font = "48px AtariChunky";
                ctx.fillStyle = "#FFF";
                ctx.fillText(text, canvas.width / 2 - (text.length * 24), canvas.height / 2);
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

        over: function () {
            this._over = true;
        },

        isOver: function () {
            return this._over;
        },

        pause: function () {
            this._paused = true;
        },

        unpause: function () {
            this._paused = false;
        },

        isStarted: function () {
            return this._started;
        },

        nextLevel: function () {
            this._currentLevel.start();
        }
    };

    //return a reference to the constructor function.
    return Game;
});