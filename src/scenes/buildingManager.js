var c      = require('../config/constantes');
var images = require('../config/manifest')["images"];


scene.define('batiment', function() {
    entity('draw').create(this.buildParams);
});

function getBoardIndex(grid, index)
{
    var height = grid.board.length;
    var boardIndex = {
        x : index % height,
        y : Math.floor(index / height)
    };

    return boardIndex;
}

function checkTileType(grid, index)
{
    var boardIndex = getBoardIndex(grid, index);
    if (grid.board[boardIndex.y][boardIndex.x] === 1)
        return 0;

    return 1;
}

function changeTileType(grid, index)
{
    var boardIndex = getBoardIndex(grid, index);
    grid.board[boardIndex.y][boardIndex.x] = 1;
}

scene.on("grid:selectTile", function(grid, index, tile)
{
    var tileCount = c.MAP_SIZE / c.TILE_SIZE *2;
    var validCount = 0;
    var buildingSize = 1;

    for (var i = 0; i < buildingSize; i++)
    {
        for (var j = 0; j < buildingSize; j++)
        {
            validCount += checkTileType(grid, index - j * tileCount + i);
        }
    }

    if (validCount === (buildingSize*buildingSize) && grid.isBuilding)
    {
        var center = component('center').of(tile);
        scene('batiment').instanciate({
            context : grid.context,
            buildParams : {
                position : {
                    x : center.x - c.TILE_SIZE / 4,
                    y : center.y - c.TILE_SIZE / (8 / buildingSize)
                },
                size : {
                    width : c.TILE_SIZE / 2 * buildingSize,
                    height : c.TILE_SIZE / 4 * buildingSize
                },
                draw : {
                    image : images["tree"]
                }
            }
        });

        for (var i = 0; i < buildingSize; i++)
        {
            for (var j = 0; j < buildingSize; j++)
            {
                validCount += changeTileType(grid, index - j * tileCount + i);
            }
        }
        component.trigger('a_star:change');
    }
});