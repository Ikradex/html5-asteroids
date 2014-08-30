requirejs.config({
    // append a timestamp to our script urls to keep them fresh
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'soundmanager2': 'vendor/js/soundmanager2/soundmanager2-jsmin',
        'soundManager': 'assets/src/lib/util/soundmanager',
        'PxLoader': 'vendor/js/PxLoader/PxLoader',
        'PxLoaderImage': 'vendor/js/PxLoader/PxLoaderImage',
        'PxLoaderSound': 'vendor/js/PxLoader/PxLoaderSound',
        'KeyboardState': 'vendor/js/THREEx/KeyboardState',
        'InvalidArgumentError': 'assets/src/lib/error/InvalidArgumentError',
        'Loader': 'assets/src/Loader',
        'Point': 'assets/src/lib/util/Point',
        'Vector2D': 'assets/src/lib/util/Vector2D',
        'Triangle2D': 'assets/src/lib/util/Triangle2D',
        'Library': 'assets/src/lib/util/Library',
        'Build': 'assets/src/Game',
        'Entity': 'assets/src/lib/entity/Entity',
        'CollidableEntity': 'assets/src/lib/collision/CollidableEntity',
        'EntityManager': 'assets/src/lib/entity/EntityManager',
        'Player': 'assets/src/lib/entity/Player',
        'Asteroid': 'assets/src/lib/entity/Asteroid',
        'EventTimer': 'assets/src/lib/util/EventTimer',
        'Projectile': 'assets/src/lib/projectile/Projectile',
        'Bullet': 'assets/src/lib/projectile/Bullet',
        'Weapon': 'assets/src/lib/weapon/Weapon',
        'Cannon': 'assets/src/lib/weapon/Cannon'
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
        width: 750,
        height: 550
    }
};

window.config = conf;