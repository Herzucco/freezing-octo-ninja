var c      = require('../config/constantes');
scene.define('camera', function(){
    var speed = 5;
    var camera = entity('camera').create({
        acceleration : {
            friction : 0
        },
        limitPosition : {
            maxX : (c.MAP_SIZE - c.CANVAS_WIDTH)/2 - c.TILE_SIZE*2,
            maxY : c.MAP_SIZE/2 - c.CANVAS_HEIGHT + c.TILE_SIZE/2,
            minX : -c.MAP_SIZE/2
        }
    });
    var cameraVelocity = component('velocity').of(camera);
    this.cameraPosition = component('position').of(camera);

    this.container = new PIXI.DisplayObjectContainer();

    this.container.position = this.cameraPosition;

    var eventContext = {
        context : this
    };

    scene.on('cameraTest:right', function(){
        speed++;
        component('acceleration').of(camera).friction = 0;
        cameraVelocity.x = -speed;
    }, eventContext);
    scene.on('cameraTest:left', function(){
        speed++;
        component('acceleration').of(camera).friction = 0;
        cameraVelocity.x = speed;
    }, eventContext);
    scene.on('cameraTest:up', function(){
        speed++;
        component('acceleration').of(camera).friction = 0;
        cameraVelocity.y = speed;
    }, eventContext);
    scene.on('cameraTest:down', function(){
        speed++;
        component('acceleration').of(camera).friction = 0;
        cameraVelocity.y = -speed;
    }, eventContext);
    scene.on('cameraTest:stop', function(){
        component('acceleration').of(camera).friction = 0.5;
        speed = 10;
    }, eventContext);
});