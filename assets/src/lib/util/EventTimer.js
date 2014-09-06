/*global define*/

define(function () {
    "use strict";

    /**
     * Event Timer class.
     *
     * Callback is called after a specified
     * time is spent in the game loop.
     *
     * @param {Integer}  time in milliseconds
     * to spend in the game loop before the
     * callback is called
     * @param {Function} callback the function
     * to be called after the time is spent
     */
    function EventTimer(time, callback) {
        if (!(this instanceof EventTimer)) {
            throw new TypeError("EventTimer constructor cannot be called as a function.");
        }

        this._waitTime = time; // the time first specified
        this._timeRemaining = time; // the time left until callback is called
        this._callback = callback; // the callback function
    }

    EventTimer.prototype = {
        constructor: EventTimer,

        /**
         * Tells the event timer to spend time
         * in the game loop. The function callback
         * is called once the time specified runs
         * out, the timer is then reset.
         *
         * @param  {Double} dt delta-time used to
         * wait an accurate amount of time
         * @return {void}
         */
        wait: function (dt) {
            if (this._timeRemaining > 0) {
                this._timeRemaining -= (1000 * dt);
            } else {
                this._callback.call();
                this.reset();
            }
        },

        reset: function () {
            this._timeRemaining = this._waitTime;
        },

        setWaitTime: function (time) {
            this._waitTime = time;
            this._timeRemaining = time;
        },

        getWaitTime: function () {
            return this._waitTime;
        },

        setTimeRemaining: function (time) {
            this._timeRemaining = time;
        },

        getTimeRemaining: function () {
            return this._timeRemaining;
        }
    };

    //return a reference to the constructor function.
    return EventTimer;
});