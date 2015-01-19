/*global define*/

define("Library", [], function () {
    "use strict";

    /**
     * Count the elements of enumerable
     *
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    Object.size = function (obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // "extends" is a reserved word in ECMAScript
    Function.prototype.inherits = function (parents) {
        for (var i = 0; i < parents.length; i++) {
            this.prototype = Object.create(parents[i].prototype);
        }
    };

    function Library() {
        if (!(this instanceof Library)) {
            throw new TypeError("Library constructor cannot be called as a function.");
        }
    }

    /**
     * Returns a random number between min and max
     * @param  {[type]} min
     * @param  {[type]} max
     * @return {[type]}
     */
    Library.randomDouble = function (min, max) {
        if (min === 'undefined' || max === 'undefined') {
            return Math.random();
        } else {
            return Math.random() * (max - min) + min;
        }
    };

    /**
     * Returns a random integer between min and max
     * Using Math.round() will give you a non-uniform distribution!
     * @param  {[type]} min
     * @param  {[type]} max
     * @return {[type]}
     */
    Library.randomInteger = function (min, max) {
        if (min === 'undefined' || max === 'undefined') {
            return Math.floor(Math.random());
        } else {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    Library.randomBoolean = function () {
        return (Library.randomInteger(0, 1) == 1);
    };

    Library.randomXY = function (min, max) {
        return {
            x: Library.randomDouble(min, max),
            y: Library.randomDouble(min, max)
        };
    };

    /**
     * Determines whether two circles intersect
     * Returns the distance between origins is less than the combined radii of the circles
     *
     * @param  {Integer} c1X x-coord of circle1 origin
     * @param  {Integer} c1Y y-coord of circle1 origin
     * @param  {Double} c1Radius radius of cricle1
     * @param  {Integer} c2X x-coord of circle2 origin
     * @param  {Integer} c2Y y-coord of circle2 origin
     * @param  {Double} c2Radius radius of cricle2
     * @return {Boolean}
     */
    Library.circlesIntersect = function (c1X, c1Y, c1Radius, c2X, c2Y, c2Radius) {
        var distanceX = c2X - c1X;
        var distanceY = c2Y - c1Y;

        var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return magnitude < c1Radius + c2Radius;
    };

    /**
     * Gets the x and y coords of the meeting point of two circles
     *
     * @param  {Integer} c1X x-coord of circle1 origin
     * @param  {Integer} c1Y y-coord of circle1 origin
     * @param  {Double} c1Radius radius of cricle1
     * @param  {Integer} c2X x-coord of circle2 origin
     * @param  {Integer} c2Y y-coord of circle2 origin
     * @param  {Double} c2Radius radius of cricle2
     * @return {Point}
     */
    Library.circlesIntersectionPoint = function (c1X, c1Y, c1Radius, c2X, c2Y, c2Radius) {
        return {
            x: ((c1X * c2Radius) + (c2X * c1Radius)) / (c1Radius + c2Radius),
            y: ((c1Y * c2Radius) + (c2Y * c1Radius)) / (c1Radius + c2Radius)
        }
    };

    /**
     * [pointOnCircumference description]
     * @param  {[type]} origin [description]
     * @param  {[type]} radius [description]
     * @param  {[type]} angle  [description]
     * @return {[type]}        [description]
     */
    Library.pointOnCircumference = function (origin, radius, angle) {
        return {
            x: origin.x + radius * Math.cos(angle),
            y: origin.y + radius * Math.sin(angle)
        };
    };

    Library.pointIntersectsCircle = function (pX, pY, cX, cY, cR) {
        var x = pX - cX,
            y = pY - cY,
            rr = cR * cR;

        return ((x * x) + (y * y) <= rr);
    };

    Library.elasticCollisionVelocities = function (v1, m1, v2, m2) {
        return {
            x: (v1.x * (m1 - m2) + (2 * m2 * v2.x)) / (m1 + m2),
            y: (v1.y * (m1 - m2) + (2 * m2 * v2.y)) / (m1 + m2)
        };
    };

    Library.forceOfGravity = function (G, m1, m2, r) {
        return (G * m1 * m2) / (r * r);
    };

    Library.contains = function (array, elem) {
        return array.indexOf(elem) >= 0;
    };

    Library.removeArrayElem = function (array, elem) {
        return array.splice(array.indexOf(elem), 1);
    };

    Library.toRadians = function (deg) {
        return deg * (Math.PI / 180);
    };

    Library.toDegrees = function (rad) {
        return rad * (180 / Math.PI);
    };

    Library.normalize = function (x, min, max, a, b) {
        return (((b - a) * (x - min)) / max - min) + a;
    };

    return Library;
});