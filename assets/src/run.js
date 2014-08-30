/*global window, require, canvas*/

require(["Loader", "Build"], function (loader, Game) {
    "use strict";

    loader.addCompletionListener(function (e) {
        //==============================//
        // Main Loop
        //==============================//

        var game = new Game();
        game.start();

        var animationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame || null;

        var then = Date.now();

        var main = function () {
            var now = Date.now(),
                dt = (now - then) / 1000;

            if (game.isStarted()) {
                game.getUserInput(dt);
                game.update(dt);
                game.render();
            }

            then = now;
        };

        if (animationFrame !== null) {
            var mainLoop = function () {
                main();
                animationFrame(mainLoop, canvas);
            }

            animationFrame(mainLoop, canvas);
        } else {
            // for IE9
            setInterval(main, 1000 / Game.FPS);
        }
    });

    loader.start();
});