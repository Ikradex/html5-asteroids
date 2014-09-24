/*global define, game, canvas, ctx*/

define("EntityManager", [
    "Library",
    "Vector2D",
    "Asteroid",
    "Player",
    "Enemy",
    "Projectile"
], function (Library, Vector2D, Asteroid, Player, Enemy, Projectile) {
    "use strict";

    function EntityManager() {
        if (!(this instanceof EntityManager)) {
            throw new TypeError("EntityManager constructor cannot be called as a function.");
        }

        this._players = [];
        this._enemies = [];
        this._asteroids = [];
        this._projectiles = [];
    }

    EntityManager.prototype = {
        constructor: EntityManager,

        processInput: function (dt) {
            this._players.forEach(function (player) {
                player.processInput(dt);
            });
        },

        update: function (dt) {
            this._projectiles.forEach(function (projectile) {
                if (!projectile.getDestroyed()) {
                    if (projectile.getTravelDistance() < projectile.getMaxTravelDistance()) {
                        projectile.update(dt);
                    } else {
                        Library.removeArrayElem(this._projectiles, projectile);
                    }
                } else {
                    Library.removeArrayElem(this._projectiles, projectile);
                }
            }.bind(this));

            this._asteroids.forEach(function (asteroid) {
                asteroid.update(dt);
            });

            this._enemies.forEach(function (enemy) {
                if (!enemy.getDestroyed()) {
                    enemy.update(dt);
                } else {
                    Library.removeArrayElem(this._enemies, enemy);
                }
            }.bind(this));

            this._players.forEach(function (player) {
                player.update(dt);
            });
        },

        render: function () {
            this._projectiles.forEach(function (projectile) {
                projectile.render();
            });

            this._players.forEach(function (player) {
                player.render();
            });

            this._enemies.forEach(function (enemy) {
                enemy.render();
            });

            this._asteroids.forEach(function (asteroid) {
                asteroid.render();
            });
        },

        _processCollisions: function () {
            var entities = this.getEntities();

            for (var i = 0; i < entities.length; i++) {
                var entA = entities[i];

                for (var j = i + 1; j < entities.length; j++) {
                    var entB = entities[j];

                    if ((!entA.getDestroyed() && !entB.getDestroyed()) && entA.intersects(entB)) {
                        entA.destroy(entB);
                        entB.destroy(entA);
                    }
                }
            }
        },

        _processGravity: function () {
            var entities = this.getEntities();

            for (var i = 0; i < entities.length; i++) {
                var entA = entities[i];

                for (var j = i + 1; j < entities.length; j++) {
                    var entB = entities[j];
                    if (entA.distanceTo(entB) <= Game.GRAV_MIN_DISTANCE) {
                        entA.attracts(entB);
                    }
                }
            }
        },

        processInteractions: function () {
            this._processCollisions();

            if (Game.PHYSICS_LEVEL > 0) {
                this._processGravity();
            }
        },

        isRespawnClear: function () {
            var clear = true,
                respawn = {
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    r: 75
                };

            for (var i = 0; i < this._asteroids.length; i++) {
                var asteroid = this._asteroids[i];

                if (Library.circlesIntersect(respawn.x, respawn.y, respawn.r,
                    asteroid.getPos().x, asteroid.getPos().y, asteroid.getDimensions().width)) {
                    clear = false;
                    break;
                }
            }

            return clear;
        },

        getEntities: function () {
            var entities = [];

            entities = entities.concat(this._players);
            entities = entities.concat(this._asteroids);
            entities = entities.concat(this._enemies);
            entities = entities.concat(this._projectiles);

            return entities;
        },

        addPlayer: function (player) {
            this._players.push(player);
        },

        removePlayer: function (player) {
            Library.removeArrayElem(this.getPlayers(), player);
        },

        isPlayer: function (player) {
            return player instanceof Player;
        },

        addEnemy: function (enemy) {
            this._enemies.push(enemy);
        },

        removeEnemy: function (enemy) {
            Library.removeArrayElem(this.getEnemies(), enemy);
        },

        isEnemy: function (enemy) {
            return enemy instanceof Enemy;
        },

        addAsteroid: function (asteroid) {
            this._asteroids.push(asteroid);
        },

        removeAsteroid: function (asteroid) {
            Library.removeArrayElem(this.getAsteroids(), asteroid);
        },

        isAsteroid: function (asteroid) {
            return asteroid instanceof Asteroid;
        },

        addProjectile: function (projectile) {
            this._projectiles.push(projectile);
        },

        removeProjectile: function (projectile) {
            Library.removeArrayElem(this.getProjectiles(), projectile);
        },

        isProjectile: function (projectile) {
            return projectile instanceof Projectile;
        },

        getAsteroids: function () {
            return this._asteroids;
        },

        getEnemies: function () {
            return this._enemies;
        },

        getPlayers: function () {
            return this._players;
        },

        getProjectiles: function () {
            return this._projectiles;
        },

        clearAsteroids: function () {
            this._asteroids.length = 0;
        },

        clearEnemies: function () {
            this._enemies.length = 0;
        },

        clearProjectiles: function () {
            this._projectiles.length = 0;
        }
    };

    return EntityManager;
});