/*global define, canvas, ctx*/

define("EntityManager", ["Library"], function (Library) {
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
            this._findCollisions(dt);

            this._projectiles.forEach(function (projectile) {
                if (projectile.getDistanceTraveled() < projectile.getMaxDistance()) {
                    projectile.update(dt);
                } else {
                    Library.removeArrayElem(this._projectiles, projectile);
                }
            }.bind(this));

            this._asteroids.forEach(function (asteroid) {
                asteroid.update(dt);
            });

            this._enemies.forEach(function (enemy) {
                enemy.update(dt);
            });

            this._players.forEach(function (player) {
                player.update(dt);
            });
        },

        render: function () {
            this._players.forEach(function (player) {
                player.render();
            });

            this._enemies.forEach(function (enemy) {
                enemy.render();
            });

            this._projectiles.forEach(function (projectile) {
                projectile.render();
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

        /**
         * Detects collisions across all CollidableEntities
         * in the game. Entitys' destroy method is called
         * on intersection of entities.
         *
         * I am not sure if I'm interating too much in this
         * method. This is possible going to be the most
         * expensive function to call in the game and making
         * it performant would be ideal, even if the number
         * of game objects is relatively lower than other
         * games.
         */
        _findCollisions: function () {
            loop1: for (var i = 0; i < this._projectiles.length; i++) {
                var projectile = this._projectiles[i];
                var shooter = projectile.getShooter();

                for (var j = 0; j < this._asteroids.length; j++) {
                    var asteroid = this._asteroids[j];

                    if (!projectile.isDestroyed() && projectile.intersects(asteroid)) {
                        this._destroyAsteroid(asteroid, projectile);

                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);
                        projectile = null;

                        continue loop1;
                    }
                }

                for (var j = 0; j < this._players.length; j++) {
                    var player = this._players[j];

                    if (player !== shooter && projectile.intersects(player)) {
                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);

                        player.destroy();

                        continue loop1;
                    }
                }

                for (var j = 0; j < this._enemies.length; j++) {
                    var enemy = this._enemies[j];
                    if (enemy !== shooter && projectile.intersects(enemy)) {
                        enemy.destroy();

                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);

                        continue loop1;
                    }
                }
            }

            this._players.forEach(function (player) {
                this._asteroids.forEach(function (asteroid) {
                    if (player.intersects(asteroid)) {
                        player.destroy();

                        //this._destroyAsteroid(asteroid);
                    }
                }.bind(this));

                this._enemies.forEach(function (enemy) {
                    if (player.intersects(enemy)) {
                        // enemies are not affected by colliding players
                        // however players are killed instantly
                        player.destroy();
                    }
                });
            }.bind(this));

            this._enemies.forEach(function (enemy) {
                this._asteroids.forEach(function (asteroid) {
                    if (enemy.intersects(asteroid)) {
                        enemy.destroy();
                        //this._destroyAsteroid(asteroid);
                    }
                });
            }.bind(this));
        },

        _destroyAsteroid: function (asteroid, entity) {
            var children = asteroid.destroy(entity); // get the child asteroids
            Library.removeArrayElem(this._asteroids, asteroid);

            children.forEach(function (child) {
                this.addAsteroid(child);
            }.bind(this));

            asteroid = null;
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