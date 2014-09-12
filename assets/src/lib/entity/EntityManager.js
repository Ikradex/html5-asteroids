/*global define, game, canvas, ctx*/

define("EntityManager", [
    "Library",
    "Vector2D",
    "Asteroid",
    "Player",
    "Enemy"
], function (Library, Vector2D, Asteroid, Player, Enemy) {
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

        /**
         * Detects collisions across all CollidableEntities
         * in the game. Entitys' destroy method is called
         * on intersection of entities.
         *
         * Also links gravity interactions between objects
         *
         * I am not sure if I'm interating too much in this
         * method. This is possible going to be the most
         * expensive function to call in the game and making
         * it performant would be ideal, even if the number
         * of game objects is relatively lower than other
         * games.
         */
        processInput: function (dt) {
            this._players.forEach(function (player) {
                player.processInput(dt);
            });
        },

        updateEntities: function (dt) {
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

        addPlayer: function (player) {
            this._players.push(player);
        },

        addEnemy: function (enemy) {
            this._enemies.push(enemy);
        },

        addAsteroid: function (asteroid) {
            this._asteroids.push(asteroid);
        },

        addProjectile: function (projectile) {
            this._projectiles.push(projectile);
        },

        processInteractions: function () {
            this._processProjectileInteractions();
            this._processPlayerInteractions();
            this._processEnemyInteractions();
        },

        _processProjectileInteractions: function () {
            var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL,
                entities = this.getEntities();

            parentLoop: for (var i = 0; i < this._projectiles.length; i++) {
                var projectile = this._projectiles[i],
                    shooter = projectile.getShooter();

                var gravForce = new Vector2D(0, 0);

                for (var j = 0; j < entities.length; j++) {
                    var entity = entities[j];

                    if (!entity.getDestroyed() && shooter != entity) {
                        if (projectile.intersects(entity)) {
                            // inc shooter's score
                            shooter.addScore(entity.getScoreValue());

                            if (entity instanceof Asteroid) {
                                this._destroyAsteroid(entity, projectile);
                            } else {
                                entity.destroy();
                            }

                            projectile.destroy();
                            Library.removeArrayElem(this._projectiles, projectile);

                            continue parentLoop;
                        }

                        if (PHYSICS_LEVEL > 0) {
                            var force = projectile.getGravityForce(entity);
                            // accumlate gravity from entity
                            gravForce = gravForce.add(force);

                            // apply gravity from projectile
                            entity.applyForce(entity.getGravityForce(projectile));
                        }
                    }
                }

                projectile.applyForce(gravForce.scale(PHYSICS_LEVEL * 10));
            }
        },

        _processPlayerInteractions: function () {
            var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL,
                entities = this._asteroids.concat(this._enemies);

            parentLoop: for (var i = 0; i < this._players.length; i++) {
                var player = this._players[i],
                    gravforce = new Vector2D(0, 0);

                for (var j = 0; j < entities.length; j++) {
                    var entity = entities[j];

                    if (!entity.getDestroyed() && !player.getDestroyed()) {
                        if (player.intersects(entity)) {
                            player.destroy();

                            if (entity instanceof Asteroid) {
                                this._destroyAsteroid(entity, player);
                            } else if (entity instanceof Enemy) {
                                player.destroy();
                            } else {
                                entity.destroy();
                            }

                            continue;
                        }

                        if (PHYSICS_LEVEL > 0) {
                            var force = player.getGravityForce(entity);
                            gravforce = gravforce.add(force);

                            entity.applyForce(entity.getGravityForce(player).scale(PHYSICS_LEVEL));
                        }
                    }
                }

                player.applyForce(gravforce.scale(PHYSICS_LEVEL));
            }
        },

        _processEnemyInteractions: function () {
            var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL,
                entities = this._asteroids;

            for (var i = 0; i < this._enemies.length; i++) {
                var enemy = this._enemies[i];

                for (var j = 0; j < entities.length; j++) {
                    var entity = entities[j];

                    if (!entity.getDestroyed() && !enemy.getDestroyed()) {
                        if (enemy.intersects(entity)) {

                            enemy.destroy();
                            Library.removeArrayElem(this._enemies, enemy);

                            this._destroyAsteroid(entity, enemy);
                        }
                    }
                }
            }
        },

        _destroyAsteroid: function (asteroid, entity) {
            var children = asteroid.destroy(entity); // get the child asteroids
            Library.removeArrayElem(this._asteroids, asteroid);

            children.forEach(function (child) {
                this.addAsteroid(child);
            }.bind(this));
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

            entities = entities.concat(this._asteroids);
            entities = entities.concat(this._players);
            entities = entities.concat(this._enemies);

            return entities;
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
            this._asteroids = [];
        },

        clearEnemies: function () {
            this._enemies = [];
        },

        clearProjectiles: function () {
            this._projectiles = [];
        }
    };

    return EntityManager;
});