/*global define, game, canvas, ctx*/

define([
    "Library",
    "Vector2D",
    "Player",
    "Saucer",
    "Asteroid",
    "EventTimer"
], function (Library, Vector2D, Player, Saucer, Asteroid, EventTimer) {
    "use strict";

    function Level(levelNum) {
        if (!(this instanceof Level)) {
            throw new TypeError("Level constructor cannot be called as a function.");
        }

        this._levelNum = levelNum;

        this.start();

        //this._spawnPlayer();

        this.resetTimer = new EventTimer(Level.RESET_INTERVAL, function () {
            this.start();
        }.bind(this));
    }

    Level.MIN_ASTEROIDS = 4;
    Level.MAX_ASTEROIDS = 12;
    Level.ASTEROID_INIT_MASS = 1000;
    Level.ASTEROID_INIT_SCORE_VALUE = 50;
    Level.RESET_INTERVAL = 1000;

    Level.prototype = {
        constructor: Level,

        update: function (dt) {
            game.entityManager.processInteractions();
            game.entityManager.updateEntities(dt);

            if (this.over()) {
                this.resetTimer.wait(dt)
            }
        },

        render: function () {
            game.entityManager.render();
        },

        start: function () {
            game.entityManager.clearEnemies();
            game.entityManager.clearAsteroids();
            game.entityManager.clearProjectiles();

            this._levelNum++;

            var asteroidsToSpawn = (Level.MIN_ASTEROIDS + this.getLevelNum() <= Level.MAX_ASTEROIDS) ?
                Level.MIN_ASTEROIDS + this.getLevelNum() : Level.MAX_ASTEROIDS;

            for (var i = 0; i < asteroidsToSpawn; i++) {
                //this._spawnAsteroid();
            }

            this._spawnEnemy();
        },

        over: function () {
            var numEntities = game.entityManager.getAsteroids().length + game.entityManager.getEnemies();

            return (numEntities == 0);
        },

        _spawnPlayer: function () {
            var spawnPos = this.getPlayerSpawnPos(),
                player = new Player(spawnPos.x, spawnPos.y, 14, 24);

            game.entityManager.addPlayer(player);
        },

        _spawnEnemy: function () {
            var spawnPosX = 0,
                spawnPosY = Library.randomInteger(0, canvas.height);

            var xVel = Saucer.X_VELOCITY,
                yVel = 0;

            if (Library.randomBoolean()) {
                spawnPosX = canvas.width;
                xVel *= -1;
            }

            var enemy = new Saucer(spawnPosX, spawnPosY, 24, 24, 200);
            enemy.setVelocity(new Vector2D(xVel, yVel));

            game.entityManager.addEnemy(enemy);
        },

        _spawnAsteroid: function () {
            // get asteroid random position
            var spawnRadius = 50;

            var asteroidDim = {
                width: Asteroid.DEFAULT_WIDTH,
                height: Asteroid.DEFAULT_WIDTH
            };

            // prevent spawning on player
            var playerPos = (game.entityManager.getPlayers().length > 0) ? game.entityManager.getPlayers()[0].getPos() : this.getPlayerSpawnPos();

            var pXPos = Library.randomInteger(Asteroid.DEFAULT_WIDTH / 2, playerPos.x - spawnRadius),
                pXNeg = Library.randomInteger(playerPos.x + spawnRadius, canvas.width - asteroidDim.width / 2),
                pYPos = Library.randomInteger(asteroidDim.height / 2, playerPos.y - spawnRadius),
                pYNeg = Library.randomInteger(playerPos.y + spawnRadius, canvas.height - asteroidDim.height / 2);

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

            var asteroid = new Asteroid(pX, pY, 60, 60, Level.ASTEROID_INIT_MASS, Level.ASTEROID_INIT_SCORE_VALUE, randVel, 1);

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