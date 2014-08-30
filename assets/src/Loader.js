/*global window, define, config*/

define("Loader", ['soundManager',
    'PxLoader',
    'PxLoaderImage',
    'PxLoaderSound'
], function (soundManager, PxLoader) {
    "use strict";

    var canvas = document.getElementById("game-canvas");

    var complete = false;

    if (canvas === null || canvas === 'undefined') {
        canvas = document.createElement("canvas");
        canvas.id = "game-canvas";

        document.getElementsByTagName("body")[0].appendChild(canvas);
    }

    canvas.width = config.viewport.width;
    canvas.height = config.viewport.height;
    var ctx = canvas.getContext("2d");

    window.canvas = canvas;
    window.ctx = ctx;

    ctx.font = "64px AtariChunky";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFF";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.fillText("0%", canvas.width / 2 - ("0%".length * 16), canvas.height / 2);

    console.info("Starting loader");

    var loader = new PxLoader(),
        baseImgUrl = "assets/img/",
        baseSndUrl = "assets/snd/";

    var imgs = [];

    for (var i = 1; i < 6; i++) {
        var url = baseImgUrl + "asteroid" + i + ".svg";
        imgs["asteroid_" + (i - 1)] = loader.addImage(url, "asteroid_" + i);
    }

    imgs["ship"] = loader.addImage(baseImgUrl + "ship.png");
    imgs["ship_motion"] = loader.addImage(baseImgUrl + "ship_motion.png");

    window.imgs = imgs;

    loader.addSound("shoot", baseSndUrl + "asteroids_shoot.wav");
    loader.addSound("boom_low", baseSndUrl + "asteroids_die_low.mp3");
    loader.addSound("boom_med", baseSndUrl + "asteroids_die_med.mp3");
    loader.addSound("boom_high", baseSndUrl + "asteroids_die_high.mp3");
    loader.addSound("saucer", baseSndUrl + "asteroids_saucer.mp3");
    loader.addSound("saucer_high", baseSndUrl + "asteroids_saucer_high.mp3");
    loader.addSound("tone_high", baseSndUrl + "asteroids_tone_high.mp3");
    loader.addSound("tone_low", baseSndUrl + "asteroids_tone_low.mp3");
    loader.addSound("bonus", baseSndUrl + "asteroids_bonus_alt.mp3");

    // callback that runs every time an asset loads 
    loader.addProgressListener(function (e) {
        var prog = e.completedCount / e.totalCount,
            progDisp = Math.round(prog * 100) + "%";

        console.debug("Loaded " + e.resource.getName() + ": " + e.completedCount + ' / ' + e.totalCount);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#FFF";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.fillText(progDisp, canvas.width / 2 - (progDisp.length * 32), canvas.height / 2 + 16);
    });

    loader.addCompletionListener(function (e) {
        console.log("Download queue complete: " + e.completedCount + " of " + e.totalCount);
    });

    return loader;
});