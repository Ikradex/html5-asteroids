/*global define, canvas, ctx*/

define("ParticleEmitter", [
    "Particle",
    "Explosion",
    "Library"
], function (Particle, Explosion, Library) {
    "use strict";

    function ParticleEmitter() {
        if (!(this instanceof ParticleEmitter)) {
            throw new TypeError("ParticleEmitter constructor cannot be called as a function.");
        }

        this._particles = [];
        this._explosions = [];
    }

    ParticleEmitter.prototype = {
        constructor: ParticleEmitter,

        update: function (dt) {
            this._particles.forEach(function (particle) {
                if (!particle._destroyed) {
                    particle.update(dt);
                } else {
                    this.removeParticle(particle);
                }
            }.bind(this));

            this._explosions.forEach(function (explosion) {
                if (!explosion._destroyed) {
                    explosion.update(dt);
                } else {
                    this.removeExplosion(explosion);
                }
            }.bind(this));
        },

        render: function () {
            this._particles.forEach(function (particle) {
                particle.render();
            });

            this._explosions.forEach(function (explosion) {
                explosion.render();
            });
        },

        emit: function (x, y, wh, mass, force) {
            var particle = new Particle(x, y, wh, mass);
            particle.applyForce(force);

            this._particles.push(particle);
        },

        explode: function (x, y) {
            var explosion = new Explosion(x, y);

            this._explosions.push(explosion);
        },

        getParticles: function () {
            return this._particles;
        },

        removeParticle: function (particle) {
            Library.removeArrayElem(this._particles, particle);
        },

        removeExplosion: function (explosion) {
            Library.removeArrayElem(this._explosions, explosion);
        },

        clearParticles: function () {
            this._particles.length = 0;
        }
    };

    return ParticleEmitter;
});