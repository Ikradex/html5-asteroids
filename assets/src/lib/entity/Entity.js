/*global define, canvas*/

define("Entity", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Entity(x, y, width, height, mass, scoreValue) {
        if (!(this instanceof Entity)) {
            throw new TypeError("Entity constructor cannot be called as a function.");
        }

        this._scoreValue = scoreValue;
        this._score = 0;

        this._pos = new Vector2D(x, y);
        this._velocity = new Vector2D(0, 0);
        this._acceleration = new Vector2D(0, 0);

        this._forces = new Vector2D(0, 0);
        this._mass = mass;

        this._theta = Math.PI / 2; // in radians
        this._dTheta = 4.975; // in radians
        this._dir = new Vector2D(-Math.cos(this._theta), -Math.sin(this._theta));

        if (width !== "undefined" && height !== "undefined") {
            this._width = width;
            this._height = height;
        }

        this._bounds = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }

    Entity.prototype = {
        constructor: Entity,

        getPos: function () {
            return this._pos;
        },

        getVelocity: function () {
            return this._velocity;
        },

        getAcceleration: function () {
            return this._acceleration;
        },

        getForces: function () {
            return this._forces;
        },

        getMass: function () {
            return this._mass;
        },

        getDimensions: function () {
            return {
                width: this._width,
                height: this._height
            };
        },

        getBounds: function () {
            return this._bounds;
        },

        getScore: function () {
            return this._score;
        },

        getScoreValue: function () {
            return this._scoreValue;
        },

        setPos: function (pos) {
            // Rounding to whole numbers when setting position
            // improves performance when rendering in Integer values
            // as opposed to decimal. Not necessary for this low-graphics
            // game but good habit to remember.
            // Reference: http://jsperf.com/drawimage-whole-pixels
            this._pos = pos;
        },

        setVelocity: function (velocity) {
            this._velocity = velocity;
        },

        setMass: function (mass) {
            this._mass = mass;
        },

        setDimensions: function (w, h) {
            this._width = w;
            this._height = h;
        },

        setBounds: function (bounds) {
            this._bounds = bounds;
        },

        setScore: function (score) {
            this._score = score;
        },

        addScore: function (score) {
            this._score += score;
        },

        setScoreValue: function (scoreValue) {
            this._scoreValue = scoreValue;
        },

        applyForce: function (force) {
            this._forces = this.getForces().add(force);
            this._acceleration = this.getAcceleration().add(this._compute_dAcceleration(this.getForces()));
        },

        _compute_dTheta: function (dir, dt) {
            return this._dTheta * dir * dt;
        },

        _compute_dForce: function (dir, force) {
            // add XY forces of engine at direction
            return dir.scale(force);
        },

        _compute_dVelocity: function (acceleration, dt) {
            return acceleration.scale(dt);
        },

        _compute_dAcceleration: function (force) {
            return new Vector2D(force.x / this.getMass(), force.y / this.getMass()); // a = f / m
        },

        _updatePosition: function (dt) {
            var newPos = this._checkOutOfBounds();

            if (newPos.x != this.getPos().x || newPos.y != this.getPos().y) {
                this._handleOutOfBounds(newPos);
            }

            this._velocity = this.getVelocity().add(this.getAcceleration());

            this._pos = this.getPos().add(this.getVelocity().scale(dt));

            this.getAcceleration().setComponents(0, 0);
            this.getForces().setComponents(0, 0);
        },

        _checkOutOfBounds: function () {
            var width = (this.getDimensions().width !== "undefined") ? this.getDimensions().width : 0,
                height = (this.getDimensions().height !== "undefined") ? this.getDimensions().height : 0;

            var newPos = this.getPos().clone(),
                bounds = this.getBounds();

            if (newPos.x < bounds.x - width) {
                newPos.x = (bounds.x + bounds.width) + width;
            }

            if (newPos.x > (bounds.x + bounds.width) + width) {
                newPos.x = bounds.x - width;
            }

            if (newPos.y < bounds.y - height) {
                newPos.y = (bounds.y + bounds.height) + height;
            }

            if (newPos.y > (bounds.y + bounds.height) + height) {
                newPos.y = bounds.y - height;
            }

            return newPos;
        },

        _handleOutOfBounds: function (correctedPos) {
            this.setPos(correctedPos);
        }
    };

    return Entity;
});