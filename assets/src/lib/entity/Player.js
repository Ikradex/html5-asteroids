/*global define, canvas, ctx, game*/

define("Player", [
    "EventTimer",
    "CollidableEntity",
    "Cannon",
    "Minigun",
    "Vector2D",
    "Library"
], function (EventTimer, CollidableEntity, Cannon, Minigun, Vector2D, Library) {
    "use strict";

    Player.inherits([CollidableEntity]);

    function Player(x, y, width, height) {
        CollidableEntity.apply(this, [x, y, width, height, Player.INIT_MASS, Player.SCORE_VALUE]); // call super

        if (!(this instanceof Player)) {
            throw new TypeError("Player constructor cannot be called as a function.");
        }

        this.lives = 3;
        this._maxLives = 4;
        this._canRespawn = false;

        this._score_to_reward = 10000;

        var weaponPos = Library.pointOnCircumference(this.getPos(), this.getDimensions().width / 2, this.getRad() - Math.PI);
        this._weapon = new Minigun(weaponPos.x, weaponPos.y);
        this._fireLock = false;
        this._enginePower = 400;

        this._thruster_dRad = Library.toRadians(3.5);

        this._maxVelocity = 500;

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
            this._move(dt);
            this._weapon.update(dt);

            if (this.getScore() >= this._score_to_reward) {
                this.lives++;
                this._score_to_reward += 10000;
                // play reward sound
            }

            if (this._score_interp < this.getScore()) {
                this._score_interp += 5;
            }
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
            ctx.rotate(this.getRad() - Math.PI / 2);
            ctx.drawImage(this._img, -(this.getDimensions().width / 2), -(this.getDimensions().height / 2), this.getDimensions().width, this.getDimensions().height);
            ctx.restore();

            this._weapon.render();
        }
    };

    Player.prototype.processInput = function (dt) {
        if (!this.getDestroyed()) {
            var input = game.input;

            if (input.pressed("A") || input.pressed("left")) {
                this.rotate(this._compute_thruster_dRad(-1, dt));
            }

            if (input.pressed("D") || input.pressed("right")) {
                this.rotate(this._compute_thruster_dRad(1, dt));
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

    Player.prototype.rotate = function(dRad) {
        var resulting_rad = this.getRad() + dRad;
        
        if (resulting_rad > Math.PI * 2) {
            resulting_rad = 0;
        }

        if (resulting_rad < 0) {
            resulting_rad = Math.PI * 2;
        }

        this.setRad(resulting_rad);
        this._weapon.rotate(dRad - Math.PI, this.getPos());
    };

    Player.prototype.thrust = function () {
        var thrustForce = this.getTheta().scale(this._enginePower);
        this.applyForce(thrustForce);

        this._img = imgs["ship_motion"];
    };

    Player.prototype.shoot = function (dt) {
        var opposingForce = this._weapon.fire(this, this.getVelocity(), this.getRad(), dt);

        this.applyForce(opposingForce.scale(Game.PHYSICS_LEVEL));
    };

    Player.prototype._move = function (dt) {
        this._updatePosition(dt);
        this.setVelocity(this.getVelocity().scale(0.99));

        this._thrusterDir = this.getRad() + Math.PI;

        var weaponPos = Library.pointOnCircumference(this.getPos(), this.getDimensions().width / 2, this.getRad() - Math.PI);
        this._weapon.setPos(new Vector2D(weaponPos.x, weaponPos.y));
    };

    // Override CollidableEntity.attracts
    Player.prototype.attracts = function (entity) {
        var valid = true;

        if (game.entityManager.isProjectile(entity)) {
            valid = (entity.getShooter() != this);
        }

        if (valid) {
            var force = this._getGravityForce(entity);
            this.applyForce(force.scale(Game.PHYSICS_LEVEL));
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
            for (var i = 0; i < Library.randomInteger(3, 8) * Game.PARTICLES; i++) {
                var ang = Library.randomInteger(-180, 180),
                    dir = new Vector2D(Math.cos(ang), Math.sin(ang));

                var wh = Library.randomInteger(1, 2),
                    mass = Library.randomDouble(5, 10),
                    force = dir.scale(300);

                game.particleEmitter.emit(entity.getPos().x, entity.getPos().y, wh, mass, force);
                game.particleEmitter.explode(entity.getPos().x, entity.getPos().y);
            }

            if (this.lives <= 0) {
                game.entityManager.remove(this);
            }
        }
    };

    Player.prototype._compute_thruster_dRad = function(dir, dt) {
        return this._thruster_dRad * dir;
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