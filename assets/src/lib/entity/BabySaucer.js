/*global define, canvas, ctx*/

define("BabySaucer", [
    "Saucer",
    "Vector2D",
    "Library"
], function (Saucer, Vector2D, Library) {
    "use strict";

    BabySaucer.inherits([Saucer]);

    function BabySaucer(x, y, width, height, scoreValue) {
        Saucer.apply(this, [x, y, width, height, scoreValue]);

        if (!(this instanceof BabySaucer)) {
            throw new TypeError("BabySaucer constructor cannot be called as a function.");
        }

        // this.setDestroySound("snd_destroy_hi");
    }

    BabySaucer.SCORE_VALUE = 1000;

    // Override Enemy.shoot
    BabySaucer.prototype.shoot = function (dt) {
        var closestPlayer = this.getNearestEntity(game.entityManager.getPlayers());

        this.setDir(this.aim(closestPlayer));
        this.getWeapon().fire(this, this.getVelocity(), this.getDir(), dt);
    };

    return BabySaucer;
});