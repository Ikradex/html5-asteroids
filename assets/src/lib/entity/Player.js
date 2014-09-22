/*global define, canvas, ctx, game*/

define("Player", [
    "EventTimer",
    "CollidableEntity",
    "Cannon",
    "Vector2D",
    "Library"
], function (EventTimer, CollidableEntity, Cannon, Vector2D, Library) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, [x, y, width, height, Player.INIT_MASS, Player.SCORE_VALUE]); // call super

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this.lives = 3;
        this._canRespawn = false;

        var weaponPos = Library.pointOnCircumference(this.getPos(), this.getDimensions().width / 2, this._theta - Math.PI);
        this._weapon = new Cannon(weaponPos.x, weaponPos.y);
        this._fireLock = false;
        this._enginePower = 1800;

        this._dTheta = 3.5;

        this._respawnTimer = new EventTimer(Player.RESPAWN_INTERVAL, function () {
            this._canRespawn = true;
        }.bind(this));

        this._img = imgs["ship"];
    }

    Player.MAX_LIVES = 4;
    Player.INIT_MASS = 300;
    Player.SCORE_VALUE = 1000;
    Player.RESPAWN_INTERVAL = 3000;

    /* Public */

    Player.prototype.update = function (dt) {
        if (!this.getDestroyed()) {
            this._updatePosition(dt);
            this._weapon.update(dt);
        } else {
            this._respawnTimer.wait(dt);

            if (this._canRespawn && game.entityManager.isRespawnClear()) {
                this._respawn();
            }
        }
    };

    Player.prototype.render = function () {
        if (!this.getDestroyed()) {
            ctx.save();
            ctx.translate(this.getPos().x, this.getPos().y);
            ctx.rotate(this._theta - Math.PI / 2);
            ctx.drawImage(this._img, -(this._width / 2), -(this._height / 2), this.getDimensions().width, this.getDimensions().height);
            ctx.restore();
        }
    };

    Player.prototype.processInput = function (dt) {
        if (!this.getDestroyed()) {
            var input = game.input;

            if (input.pressed("A") || input.pressed("left")) {
                this.rotate(this._compute_dTheta(-1, dt));
            }

            if (input.pressed("D") || input.pressed("right")) {
                this.rotate(this._compute_dTheta(1, dt));
            }

            if (input.pressed("W") || input.pressed("up")) {
                this.thrust();
            } else {
                this._img = imgs["ship"];
            }

            if (input.pressed("space")) {
                if (!this._weapon.getFireLock() || !this._fireLock) {
                    this.shoot(dt);
                    this._fireLock = !this._fireLock;
                }
            } else {
                this._fireLock = false;
            }
        }
    };

    Player.prototype.rotate = function (theta) {
        var resulting_theta = this._theta + theta;

        if (resulting_theta > Math.PI) {
            resulting_theta = -(Math.PI);
        }

        if (resulting_theta < -(Math.PI)) {
            resulting_theta = Math.PI;
        }

        this._theta = resulting_theta;
        this._dir.setComponents(-Math.cos(resulting_theta), -Math.sin(resulting_theta));

        this._weapon.rotate(theta - Math.PI, this.getPos());
    };

    Player.prototype.rotateTo = function (theta) {
        var diff_theta = Math.abs(theta - this._theta);

        diff_theta *= (theta < this._theta) ? 1 : -1;

        this._theta = theta;
        this._dir.setComponents(-Math.cos(theta), -Math.sin(theta));
    };

    Player.prototype.thrust = function () {
        var thrustForce = this.getDir().scale(this._enginePower);
        this.applyForce(thrustForce);

        this._img = imgs["ship_motion"];
    };

    Player.prototype.shoot = function (dt) {
        var PHYSICS_LEVEL = game.getConsts().PHYSICS_LEVEL;

        var opposingForce = this._weapon.fire(this, this.getVelocity(), this.getDir(), dt);

        if (PHYSICS_LEVEL > 0) {
            this.applyForce(opposingForce.scale(PHYSICS_LEVEL));
        }
    };

    // Override Entity._updatePosition
    Player.prototype._updatePosition = function (dt) {
        this._handleOutOfBounds(this._checkOutOfBounds());
        this.setPos(this.getPos().add(this.getVelocity().scale(dt)));
        this.setVelocity(this.getVelocity().add(this.getAcceleration()));
        // add friction (I know, I know, space, but game-mechanics)
        this.setVelocity(this.getVelocity().scale(0.99));

        var weaponPos = Library.pointOnCircumference(this.getPos(), this.getDimensions().width / 2, this._theta - Math.PI);
        this._weapon.setPos(new Vector2D(weaponPos.x, weaponPos.y));

        // reset acceleration and forces
        this.getAcceleration().setComponents(0, 0);
        this.getForces().setComponents(0, 0);
    };

    // Override CollidableEntity.attracts
    Player.prototype.attracts = function (entity) {
        var valid = true;

        if (game.entityManager.isProjectile(entity)) {
            valid = (entity.getShooter() != this);
        }

        if (valid) {
            var force = this._getGravityForce(entity);

            this.applyForce(force.scale(game.getConsts().PHYSICS_LEVEL));
        }
    };

    // Override CollidableEntity.destroy
    Player.prototype.destroy = function (entity) {
        var valid = true;

        if (game.entityManager.isProjectile(entity)) {
            valid = (entity.getShooter() != this);
        }

        if (valid) {
            this.setDestroyed(true);
            this.lives--;

            // emit particles
            for (var i = 0; i < Library.randomInteger(3, 8); i++) {
                var ang = Library.randomInteger(-180, 180),
                    dir = new Vector2D(Math.cos(ang), Math.sin(ang));

                var wh = Library.randomInteger(1, 2),
                    mass = Library.randomDouble(5, 10),
                    force = dir.scale(300);

                game.particleEmitter.emit(entity.getPos().x, entity.getPos().y, wh, mass, force);
                game.particleEmitter.explode(entity.getPos().x, entity.getPos().y);
            }

            if (this.lives <= 0) {
                game.entityManager.removePlayer(this);
            }
        }
    };

    Player.prototype._respawn = function () {
        var respawnPoint = new Vector2D(canvas.width / 2, canvas.height / 2);

        this.setDestroyed(false);
        this._canRespawn = false;

        this.setPos(respawnPoint);
        this._velocity.setComponents(0, 0);
        this._acceleration.setComponents(0, 0);
        this._forces.setComponents(0, 0);

        this.rotateTo(Math.PI / 2);
    };

    Player.prototype.toString = function () {
        return "Player (" + this.getPos().x + ", " + this.getPos().y + ")";
    };

    return Player;
});