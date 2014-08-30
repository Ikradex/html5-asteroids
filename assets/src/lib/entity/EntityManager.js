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
            this._projectiles.forEach(function (projectile) {
                var shooter = projectile.getShooter();

                this._asteroids.forEach(function (asteroid) {
                    if (projectile.intersects(asteroid)) {
                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);

                        this._destroyAsteroid(asteroid);
                    }
                }.bind(this));

                this._players.forEach(function (player) {
                    if (player !== shooter && projectile.intersects(player)) {
                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);

                        player.destroy();
                    }
                }.bind(this));

                this._enemies.forEach(function (enemy) {
                    if (enemy !== shooter && projectile.intersects(enemy)) {
                        projectile.destroy();
                        Library.removeArrayElem(this._projectiles, projectile);

                        enemy.destroy();
                    }
                }.bind(this));
            }.bind(this));

            this._players.forEach(function (player) {
                this._asteroids.forEach(function (asteroid) {
                    if (player.intersects(asteroid)) {
                        player.destroy();

                        this._destroyAsteroid(asteroid);
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
                        this._destroyAsteroid(asteroid);
                    }
                });
            }.bind(this));
        },

        _destroyAsteroid: function (asteroid) {
            var children = asteroid.destroy(); // get the child asteroids
            Library.removeArrayElem(this._asteroids, asteroid);

            children.forEach(function (child) {
                this.addAsteroid(child);
            }.bind(this));

            asteroid = null;
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