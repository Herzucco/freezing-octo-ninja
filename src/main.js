(function game(){
    require('./nuclear/nuclear-modules');
    require('./scenes/mapGenerator');
    require('./scenes/camera');
    require('./scenes/keyboardManager');
    require('./scenes/buffer');
    require('./scenes/webgl');
    require('./scenes/testHighness');
    require('./scenes/stagesManager');

    var loader = require('./config/loader'), 
        manifest = require('./config/manifest'), 
        c        = require('./config/constantes'), 
        maths    = require('../lib/maths'), 
        webgl    = require('../lib/webGL'),
        matrix   = maths.matrix;

    scene.define('canvas', function(){
        var pixiStage = entity('pixiDraw').create({});

        var stage = component('pixiStage').add(pixiStage, {
            width : c.CANVAS_WIDTH,
            height : c.CANVAS_HEIGHT
        });

        var bufferSprite = entity('pixiDraw').create({});
        var sprite = component('pixiSpriteCanvas').add(bufferSprite, {
            scale : 1,
            image : this.buffer,
            container : this.container
        });
        stage.stage.addChild(this.container);
        this.texture = sprite.texture;
        this.renderer = stage.renderer;
    });
    function defineCanvas(){
        scene('camera').instanciate();
        scene('keyboard').instanciate();

        var buffer    = document.createElement('canvas');
        buffer.width  = c.MAP_SIZE + c.TILE_SIZE;
        buffer.height = c.MAP_SIZE + c.TILE_SIZE;

        var bContext  = buffer.getContext('2d');
        //document.body.appendChild(buffer);
        scene.on('stagesManager:up', function(){
            bContext.clearRect(0,0,c.MAP_SIZE + c.TILE_SIZE, c.MAP_SIZE + c.TILE_SIZE)
        });
        scene.on('stagesManager:down', function(){
            bContext.clearRect(0,0,c.MAP_SIZE + c.TILE_SIZE, c.MAP_SIZE + c.TILE_SIZE)
        });

        scene('canvas').instanciate({
            buffer : buffer,
            container : scene('camera')._context.container
        });
        return {
            bContext : bContext,
            buffer   : buffer,
            texture : scene('canvas')._context.texture,
            renderer : scene('canvas')._context.renderer,
        }
    }

    function loop(){
        system.run();
        requestAnimationFrame(loop);
    }

    function start() {
        var config = defineCanvas();

        scene('testHighness').instanciate({
            x : 50,
            y : 25,
            colors : ['rgb(139, 181, 74)', 'rgb(125, 163, 67)']
        });
        system('bufferize').run();

        var tiles = {
            grass :scene('testHighness')._context.render,
        }
        scene('testHighness').instanciate({
            x : 50,
            y : 25,
            colors : ['#50462A', '#44350B']
        });
        system('bufferize').run();

        tiles.dirt = scene('testHighness')._context.render;

        scene('testHighness').instanciate({
            x : 50,
            y : 25,
            colors : ['rgb(255,255,255)', '#BBBBBB']
        });
        system('bufferize').run();

        tiles.snow = scene('testHighness')._context.render;

        scene('testHighness').instanciate({
            x : 50,
            y : 25,
            colors : ['#4B474E', '#343541']
        });
        system('bufferize').run();

        tiles.stone = scene('testHighness')._context.render;

        scene('mapGenerator').instanciate({
            tiles : tiles,
            context : config.bContext,
            cameraPosition : {
                x : -1024,
                y : 0
            }
        });

        scene('stagesManager').instanciate({
            stages : scene('mapGenerator')._context.stages,
            texture : config.texture,
            renderer : config.renderer
        });
        requestAnimationFrame(loop);
    }

    loader(start);
})();