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

        this._entities = [];
    }

    EntityManager.prototype = {
        constructor: EntityManager,

        processInput: function (dt) {
            this.getPlayers().forEach(function (player) {
                player.processInput(dt);
            });
        },

        update: function (dt) {
            this.getEntities().forEach(function (entity) {
                entity.update(dt);
            }.bind(this));
        },

        render: function () {
            this.getEntities().forEach(function (entity) {
                entity.render();
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

                for (var j = 0; j < entities.length; j++) {
                    var entB = entities[j];

                    if (entA != entB && (!entA.getDestroyed() && !entB.getDestroyed())) {
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

            var asteroids = this.getAsteroids();

            for (var i = 0; i < asteroids.length; i++) {
                var asteroid = asteroids[i];

                if (Library.circlesIntersect(respawn.x, respawn.y, respawn.r,
                    asteroid.getPos().x, asteroid.getPos().y, asteroid.getDimensions().width)) {
                    clear = false;
                    break;
                }
            }

            return clear;
        },

        add: function (entity) {
            this._entities.push(entity);
        },

        remove: function (entity) {
            Library.removeArrayElem(this._entities, entity);
        },

        getEntities: function () {
            return this._entities;
        },

        isPlayer: function (player) {
            return player instanceof Player;
        },

        isEnemy: function (enemy) {
            return enemy instanceof Enemy;
        },

        isAsteroid: function (asteroid) {
            return asteroid instanceof Asteroid;
        },

        isProjectile: function (projectile) {
            return projectile instanceof Projectile;
        },

        getAsteroids: function () {
            var asteroids = [];

            this.getEntities().forEach(function (entity) {
                if (this.isAsteroid(entity)) {
                    asteroids.push(entity);
                }
            }.bind(this));

            return asteroids;
        },

        getEnemies: function () {
            var enemies = [];

            this.getEntities().forEach(function (entity) {
                if (this.isEnemy(entity)) {
                    enemies.push(entity);
                }
            }.bind(this));

            return enemies;
        },

        getPlayers: function () {
            var players = [];

            this.getEntities().forEach(function (entity) {
                if (this.isPlayer(entity)) {
                    players.push(entity);
                }
            }.bind(this));

            return players;
        },

        getProjectiles: function () {
            var projectiles = [];

            this.getEntities().forEach(function (entity) {
                if (this.isProjectile(entity)) {
                    projectiles.push(entity);
                }
            }.bind(this));

            return projectiles;
        },

        clear: function () {
            this._entities.length = 0;
        }
    };

    return EntityManager;
});