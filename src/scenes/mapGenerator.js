var iso = require('../../lib/maths').iso;
var c      = require('../config/constantes');
var images = require('../config/manifest')["images"];
var maths = require('../../lib/maths');

var tileCount = c.MAP_SIZE / c.TILE_SIZE;
var perlin = maths.random.perlin;
var seed = 2350.4534;
var seed2 = 100.2334;
var seed3 = 290;
scene.define('mapGenerator', function() {
    var stages = {
        '-1' : []
    };
    for (var i = 0; i < tileCount; i++)
    {
        for (var j = 0; j < tileCount; j++)
        {
            var pos = {
                x : j*c.TILE_SIZE / 2 +500,
                y : i*c.TILE_SIZE / 2 +500
            }
            var tile = perlin.noise(seed, seed2, seed3);
            var base = entity('tile').create({
                position : iso.twoDToIso(pos),
                size : {
                    width  : c.TILE_SIZE,
                    height : 90
                },
                buffer : {
                    image : this.tiles['stone']
                }
            });
            stages[-1].push(base);
            for(var z = 0; z < tile; z+=0.1){
                stages[Math.round(z*10)] = stages[Math.round(z*10)] || [];

                pos.y -= 40;
                pos.x -= c.TILE_SIZE/2.5;

                if(z >= 0.6) var name = 'snow';
                else if(z >= 0.3) var name = 'grass';
                else var name = 'dirt';

                var stage = entity('tile').create({
                    position : iso.twoDToIso(pos),
                    size : {
                        width  : c.TILE_SIZE,
                        height : 90
                    },
                    buffer : {
                        image : this.tiles[name]
                    }
                });
                stages[Math.round(z*10)].push(stage);
            }

            seed += 0.01;
            seed2 += 0.1;
        }
        seed3 += 0.1;
    }
    this.stages = stages;
});

function appendTile(pos, context, camera){
    scene('testHighness').instanciate({
        x : pos.x,
        y : pos.y,
        context : context,
        cameraPosition : camera
    });
}