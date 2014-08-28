requirejs.config({
    // append a timestamp to our script urls to keep them fresh
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'soundmanager2': 'vendor/js/soundmanager2/soundmanager2-jsmin',
        'soundManager': 'assets/src/lib/soundmanager',
        'PxLoader': 'vendor/js/PxLoader/PxLoader',
        'PxLoaderImage': 'vendor/js/PxLoader/PxLoaderImage',
        'PxLoaderSound': 'vendor/js/PxLoader/PxLoaderSound',
        'KeyboardState': 'vendor/js/THREEx/KeyboardState',
        'InvalidArgumentError': 'assets/src/lib/error/InvalidArgumentError',
        'Loader': 'assets/src/Loader',
        'Point': 'assets/src/lib/util/Point',
        'Vector2D': 'assets/src/lib/util/Vector2D',
        'Triangle2D': 'assets/src/lib/util/Triangle2D',
        'Library': 'assets/src/lib/Library',
        'Build': 'assets/src/Game',
        'Player': 'assets/src/Player',
        'EventTimer': 'assets/src/lib/EventTimer',
        'Entity': 'assets/src/lib/entity/Entity',
        'CollidableEntity': 'assets/src/lib/collision/CollidableEntity'
    },
    shim: {
        'soundmanager2': {
            exports: 'soundManager'
        },
        'InvalidArgumentError': {
            exports: 'InvalidArgumentError'
        },
        'KeyboardState': {
            exports: 'KeyboardState'
        },
        'PxLoaderImage': {
            deps: ['PxLoader']
        },
        'PxLoaderSound': {
            deps: ['PxLoader']
        }
    }
});

var conf = {
    viewport: {
        width: 800,
        height: 600
    }
};

window.config = conf;