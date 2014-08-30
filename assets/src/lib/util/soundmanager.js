define("soundManager", ['soundmanager2'], function( soundManager ) {
    soundManager.setup({
        useHTML5Audio: true,
        preferFlash: false,
        useHighPerformance: true
    });
    soundManager.beginDelayedInit( );
    soundManager.audioFormats.mp3.required = false;

    window.soundManager = soundManager;
    return soundManager;
});