var c      = require('../config/constantes');
scene.define('buffer', function(){
    var buffer = entity('pixiDraw').create({
        size : {
            width : c.MAP_SIZE + c.TILE_SIZE,
            height : c.MAP_SIZE + c.TILE_SIZE
        },
        position : {
            x : -c.MAP_SIZE/2
        }
    });
    // component('scale').add(buffer, {
    //     x : 1,
    //     y : 1
    // });
    // component('render').add(buffer, {
    //     x : 1,
    //     y : 1,
    //     stroke : 'blue',
    //     fill : false
    // });
});