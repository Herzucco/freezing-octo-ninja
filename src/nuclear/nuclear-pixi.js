module.exports = function(){
    entity.define('pixiDraw', {
        components : ['position', 'size']
    });

    component.define('pixiStage', function(entity, data){
        // create an new instance of a pixi stage
        var stage = new PIXI.Stage();
     
        // create a renderer instance.
        var renderer = PIXI.autoDetectRenderer(data.width, data.height);
     
        // add the renderer view element to the DOM
        document.body.appendChild(renderer.view);
        return {
            stage : stage,
            renderer : renderer
        }
    });

    component.define('pixiSpriteCanvas', function(entity, data){
        var texture = PIXI.Texture.fromCanvas(data.image);
        // create a new Sprite using the texture
        var b = new PIXI.Sprite(texture);
        // center the sprites anchor point
        b.anchor.x = 0;
        b.anchor.y = 0;
     
        // move the sprite t the center of the screen
        b.position.x = 0;
        b.position.y = 0;
        //b.scale = data.scale || 1;
        if(data.container) data.container.addChild(b);
        else data.stage.addChild(b);

        return {
            sprite : b,
            texture : texture
        }
    });

    system.define('renderPixiStage', ['pixiStage'], function(){
        this.pixiStage.renderer.render(this.pixiStage.stage);
    });
}