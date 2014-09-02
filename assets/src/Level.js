/*global define, game, canvas, ctx*/

define([
    "Library",
    "Vector2D",
    "Player",
    "Asteroid",
    "EventTimer"
], function (Library, Vector2D, Player, Asteroid, EventTimer) {
    "use strict";

    function Level(levelNum) {
        if (!(this instanceof Level)) {
            throw new TypeError("Level constructor cannot be called as a function.");
        }

        this._levelNum = levelNum;

        this.start();
    }

    Level.MIN_ASTEROIDS = 4;
    Level.MAX_ASTEROIDS = 12;

    Level.prototype = {
        constructor: Level,

        update: function (dt) {

        },

        render: function () {

        },

        start: function () {
            this.spawnPlayer();

            var asteroidsToSpawn = (Level.MIN_ASTEROIDS + this.getLevelNum() <= Level.MAX_ASTEROIDS) ?
                Level.MIN_ASTEROIDS + this.getLevelNum() : Level.MAX_ASTEROIDS;

            for (var i = 0; i < asteroidsToSpawn; i++) {
                this.spawnAsteroid();
            }
        },

        spawnPlayer: function () {
            var spawnPos = this.getPlayerSpawnPos(),
                player = new Player(spawnPos.x, spawnPos.y, 14, 24);

            game.entityManager.addPlayer(player);
        },

        spawnAsteroid: function () {
            // get asteroid random position
            var spawnRadius = 50;

            var asteroidDim = {
                width: Asteroid.DEFAULT_WIDTH,
                height: Asteroid.DEFAULT_WIDTH
            };

            // prevent spawning on player
            var pXPos = Library.randomInteger(Asteroid.DEFAULT_WIDTH / 2, this.getPlayerSpawnPos().x - spawnRadius),
                pXNeg = Library.randomInteger(this.getPlayerSpawnPos().x + spawnRadius, canvas.width - asteroidDim.width / 2),
                pYPos = Library.randomInteger(asteroidDim.height / 2, this.getPlayerSpawnPos().y - spawnRadius),
                pYNeg = Library.randomInteger(this.getPlayerSpawnPos().y + spawnRadius, canvas.height - asteroidDim.height / 2);

            var pX = Library.randomBoolean() ? pXPos : pXNeg,
                pY = Library.randomBoolean() ? pYPos : pYNeg;

            // get asteroid random velocity
            var vMin = Asteroid.MIN_VELOCITY,
                vMax = Asteroid.MIN_VELOCITY + 5 + (Asteroid.MIN_VELOCITY * (this._levelNum * 0.2));

            if (vMax > Asteroid.MAX_VELOCITY) {
                vMax = Asteroid.MAX_VELOCITY;
            }

            var velX = Library.randomInteger(vMin, vMax) * ((Library.randomBoolean()) ? 1 : -1),
                velY = Library.randomInteger(vMin, vMax) * ((Library.randomBoolean()) ? 1 : -1);

            var randVel = new Vector2D(velX, velY); // random velocity

            var asteroid = new Asteroid(pX, pY, 60, 60, randVel, 0);

            game.entityManager.addAsteroid(asteroid);
        },

        getPlayerSpawnPos: function () {
            return new Vector2D(canvas.width / 2, canvas.height / 2);
        },

        getLevelNum: function () {
            return this._levelNum;
        }
    };

    return Level;
});