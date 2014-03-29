var sounds = require('../config/manifest')["sounds"];

scene.define('soundManager', function() {
    console.log(sounds['music1']);

    var sound = new Howl({
        urls: sounds['music1']
    }).play();
});