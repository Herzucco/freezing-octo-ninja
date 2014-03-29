var c      = require('../config/constantes');

scene.define('mouse', function() {
    var self = this;
    var canvas = document.getElementById('canvas');

    document.getElementById("canvas").addEventListener("mousedown", function(e) {
        e.preventDefault();

        var cameraPosition = scene("cameraTest")._context.cameraPosition;
        var mousePos = {
            x : (cameraPosition.x + e.layerX),
            y : cameraPosition.y + e.layerY
        };

        if (e.button === 0)
            scene.trigger("mouse:click", mousePos, 'left');
        else
            scene.trigger("mouse:click", mousePos, 'right');

    });
});