/*global define, canvas*/

define("Entity", ["Vector2D"], function (Vector2D) {
    "use strict";

    function Entity(x, y, width, height, mass, scoreValue) {
        if (!(this instanceof Entity)) {
            throw new TypeError("Entity constructor cannot be called as a function.");
        }

        this._scoreValue = scoreValue;
        this._score = 0;
        this._score_interp = this._score;

        this._pos = new Vector2D(x, y);
        this._velocity = new Vector2D(0, 0);
        this._acceleration = new Vector2D(0, 0);

        this._maxVelocity = 1000;

        this._forces = new Vector2D(0, 0);
        this._mass = mass;

        this._rad = Math.PI / 2;
        this._dRad = 0;

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

        getRad: function () {
            return this._rad;
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
                width: this._width * scaleW,
                height: this._height * scaleH
            };
        },

        getTheta: function () {
            return new Vector2D(-Math.cos(this._rad), -Math.sin(this._rad));
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

        setRad: function (rad) {
            this._rad = rad;
        },

        setVelocity: function (velocity) {
            this._velocity = velocity;
        },

        setAcceleration: function (acceleration) {
            this._acceleration = acceleration;
        },

        setForces: function (forces) {
            this._forces = forces;
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
            this.setForces(this.getForces().add(force));
            this.setAcceleration(this.getAcceleration().add(this._compute_dAcceleration(this.getForces())));
        },

        distanceTo: function (entity) {
            return this.getPos().distanceTo(entity.getPos());
        },

        rotateTo: function (rad) {
            var currRad = this._rad,
                diff_rad = Math.abs(rad - currRad);

            diff_rad *= (rad < currRad) ? 1 : -1;

            //this._theta = theta;
            //this._theta.setComponents(-Math.cos(theta), -Math.sin(theta));
            this._rad = rad;
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

            this._handleOutOfBounds(newPos);

            var velocity = this.getVelocity().add(this.getAcceleration());
            velocity.x = Math.min(Math.max(velocity.x, -this._maxVelocity), this._maxVelocity);
            velocity.y = Math.min(Math.max(velocity.y, -this._maxVelocity), this._maxVelocity);
            this.setVelocity(velocity);



            this.setPos(this.getPos().add(this.getVelocity().scale(dt)));

            this._rad += this._dRad;

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
            if (correctedPos.x != this.getPos().x || correctedPos.y != this.getPos().y) {
                this.setPos(correctedPos);
            }
        }
    };

    return Entity;
});