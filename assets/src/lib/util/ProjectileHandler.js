/*global define, window*/

define("ProjectileHandler", [], function () {
    "use strict";

    function ProjectileHandler() {
        if (!(this instanceof ProjectileHandler)) {
            throw new TypeError("ProjectileHandler constructor cannot be called as a function.");
        }

        this._projectiles = [];
    }

    ProjectileHandler.prototype = {
        constructor: ProjectileHandler,

        update: function (dt) {
            this._projectiles.forEach(function (projectile) {
                if (projectile.getDistanceTraveled() < projectile.getMaxDistance()) {
                    projectile.update(dt);
                } else {
                    this.remove(projectile);
                }
            }.bind(this));
        },

        render: function () {
            this._projectiles.forEach(function (projectile) {
                projectile.render();
            });
        },

        add: function (projectile) {
            this._projectiles.push(projectile);
        },

        remove: function (projectile) {
            this._projectiles.splice(this._projectiles.indexOf(projectile), 1);
            projectile = null;
        },

        clear: function () {
            this._projectiles = [];
        }
    };

    return ProjectileHandler;
});