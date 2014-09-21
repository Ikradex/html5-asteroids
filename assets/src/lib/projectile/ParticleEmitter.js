/*global define, canvas, ctx*/

define("ParticleEmitter", [
    "Particle",
    "Library"
], function (Particle, Library) {
    "use strict";

    function ParticleEmitter() {
        if (!(this instanceof ParticleEmitter)) {
            throw new TypeError("ParticleEmitter constructor cannot be called as a function.");
        }

        this._particles = [];
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
        },

        render: function () {
            this._particles.forEach(function (particle) {
                particle.render();
            });
        },

        emit: function (x, y, wh, mass, force) {
            var particle = new Particle(x, y, wh, mass);
            particle.applyForce(force);

            this._particles.push(particle);
        },

        getParticles: function () {
            return this._particles;
        },

        removeParticle: function (particle) {
            Library.removeArrayElem(this._particles, particle);
        },

        clearParticles: function () {
            this._particles = [];
        }
    };

    return ParticleEmitter;
});