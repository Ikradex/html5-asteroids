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

    BabySaucer.SCORE_VALUE = 500;

    // Override Enemy.shoot
    Saucer.prototype.shoot = function (dt) {
        var closestPlayer = this.getNearestEntity(game.entityManager.getPlayers());

        this._dir = this.aim(closestPlayer);
        this._weapon.fire(this, this.getPos().x, this.getPos().y, this.getVelocity(), this._dir, dt);
    };

    return BabySaucer;
});