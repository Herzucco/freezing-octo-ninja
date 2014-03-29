var c      = require('../config/constantes');
var images = require('../config/manifest')["images"];

require('../nuclear/nuclear-grid')();

scene.define('gridGenerator', function() {
    this.mousePosition = { x : 0, y : 0 };
    var self = this;

    scene.on("mouse:click", function(mousePos, button) {
        for (var i = 0; i < self.tileArray.length; i++)
        {
            var tile   = self.tileArray[i];
            var center = component('center').of(tile);
            var radius = c.TILE_SIZE / 8;

            if (mousePos.x > center.x - radius && mousePos.x < center.x + radius &&
                mousePos.y > center.y - radius && mousePos.y < center.y + radius  )
            {
                var index = self.entityToIndex[tile];

                if(button === 'left')
                    scene.trigger("grid:selectTile", self, index, tile);
                else
                    scene.trigger("grid:movePotato", self, index, tile);
                
                return;
            }
        }
    });

    visualGridGenerator(this);
});

function twoDToIso(pos)
{
  var isoPos = { x : 0, y : 0 };
  isoPos.x = (c.MAP_SIZE / 2) - c.TILE_SIZE / 2 + pos.x - pos.y;
  isoPos.y = 0 - c.TILE_SIZE + (pos.x + pos.y) / 2;
  return(isoPos);
}
var tiles     = {};
var entityToIndex = {};
var tileArray = [];
var board     = [];
var visuals   = [];
var tileCount = c.MAP_SIZE / c.TILE_SIZE;
var depth     = ((tileCount-1)*4);
function visualGridGenerator(self)
{
    for(var i = 0; i < tileCount*2; i++){
        board[i] = [];
        for(var x = 0; x < tileCount*2; x++){
            board[i][x] = 0;
        }
    }
    self.board = board;

    for (var i = tileCount; i > 0; i--)
    {
        for (var j = tileCount; j > 0; j--)
        {
            var pos = {
                x : j*c.TILE_SIZE / 2,
                y : i*c.TILE_SIZE / 2
            }

            visuals.push(entity('tile').create({
                position : twoDToIso(pos),
                size : {
                    width  : c.TILE_SIZE,
                    height : c.TILE_SIZE
                },
                draw : {
                    image : images['grass']
                },
                layer : {
                    layer : 1
                }
            }));
            pos.x += c.TILE_SIZE / 2;
            pos.y += c.TILE_SIZE / 2;

            generateVirtuals(pos, i, j)
        }
        depth-=4;
    }
    self.tiles = tiles;
    self.entityToIndex = entityToIndex;
    self.visuals = visuals;
    self.tileArray = tileArray;
}
function generateVirtuals(pos, i, j){
    var indexes = [
        tileCount*depth + (j-1)*2,
        tileCount*depth + (j-1)*2 + (tileCount*2+1),
        tileCount*depth + (j-1)*2 + (tileCount*2),
        tileCount*depth + (j-1)*2 +1,
    ]
    for (var k = 1; k >= 0; k--)
    {
        var ti = entity('virtualTile').create({
            position :
            {
                x : twoDToIso(pos).x + 3*c.TILE_SIZE/8,
                y : twoDToIso(pos).y + k*c.TILE_SIZE/4
            },
            size : {
                width  : c.TILE_SIZE / 4,
                height : c.TILE_SIZE / 4
            }
        });
        if(k === 1) var index = indexes[1];
        if(k === 0) var index = indexes[0];
        var tiPosition = component('position').of(ti);
        var tiSize = component('size').of(ti);
        var center = {
            x : tiPosition.x + tiSize.width / 2,
            y : tiPosition.y + tiSize.height / 2
        };
        component('center').add(ti, center);
        visuals.push(entity('box').create({
            render : {
                color : 'red'
            },
            position : center,
            size : tiSize,
            layer : {
                layer : 10
            }
        }));
        tiles[index] = ti;
        entityToIndex[ti] = index;
        tileArray.push(ti);
    }
    for (var l = 1; l >= 0; l--)
    {
        var ti = entity('virtualTile').create({
            position :
            {
                x : twoDToIso(pos).x + l*c.TILE_SIZE/2 + c.TILE_SIZE/8,
                y : twoDToIso(pos).y + c.TILE_SIZE/8
            },
            size : {
                width  : c.TILE_SIZE / 4,
                height : c.TILE_SIZE / 4
            }
        });
        if(l === 1) var index = indexes[3];
        if(l === 0) var index = indexes[2];
        var tiPosition = component('position').of(ti);
        var tiSize = component('size').of(ti);
        var center = {
            x : tiPosition.x + tiSize.width / 2,
            y : tiPosition.y + tiSize.height / 2
        }
        component('center').add(ti, center);
        visuals.push(entity('box').create({
            render : {
                color : 'red'
            },
            position : center,
            size : tiSize,
            layer : {
                layer : 10
            }
        }));
        tiles[index] = ti;
        entityToIndex[ti] = index;
        tileArray.push(ti);
    }
}