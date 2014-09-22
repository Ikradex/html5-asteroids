/*global window, require, canvas*/

require(["Loader", "Build"], function (loader, Game) {
    "use strict";

    loader.addCompletionListener(function (e) {
        //==============================//
        // Main Loop
        //==============================//

        var game = new Game();
        window.game = game;
        window.Game = Game;

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
            setInterval(main, 1000 / Game.MAX_FPS);
        }

        var gui = new dat.GUI();
        var f1 = gui.addFolder('Game');
        f1.add(game, '_started').name("Started");
        f1.add(game, '_paused').name("Paused");
        f1.add(Game, 'PHYSICS_LEVEL', 0, 1).name("Physics");
        f1.add(Game, 'GRAV_CONST', 0, 5).name("Gravity");
        f1.add(game, 'fps', 1, Game.MAX_FPS);
        f1.open();

        var f2 = gui.addFolder('Effects');
        f2.add(Game, 'PARTICLES', 0, 1).name("Particles");
        f2.add(Game, 'SHADOW_BLUR', 0, 1).name("Shadows");
        f2.open();

        var f3 = gui.addFolder('Entities');
        f3.add(game.entityManager._players, 'length', 0, 4).name("Players").listen();
        f3.add(game.entityManager._asteroids, 'length', 0, 48).name("Asteroids").listen();
        f3.add(game.entityManager._enemies, 'length', 0, 2).name("Enemies").listen();
        f3.add(game.entityManager._projectiles, 'length', 0, 30).name("Projectiles").listen();
        f3.add(game.particleEmitter._particles, 'length', 0, 100).name("Particles").listen();
        f3.open();

    });

    loader.start();
});