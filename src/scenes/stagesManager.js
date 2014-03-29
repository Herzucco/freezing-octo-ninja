scene.define('stagesManager', function(){
    this.currentLevel = -1;

    var eventContext = {
        context : this
    };

    scene.on('stagesManager:up', function(){
        if(this.currentLevel >= Object.keys(this.stages).length-1) return;

        this.currentLevel++;

        manageStages(this);
        PIXI.updateWebGLTexture(this.texture.baseTexture, this.renderer.gl);
    }, eventContext);
    scene.on('stagesManager:down', function(){
        if(this.currentLevel <= -1) return;

        this.currentLevel--;

        manageStages(this);
        PIXI.updateWebGLTexture(this.texture.baseTexture, this.renderer.gl);
    }, eventContext);
});

function manageStages(self){
    for(var m = -1; m < self.currentLevel; m++){
        for(var i = 0; i < self.stages[m].length; i++){
            component('buffer').enable(self.stages[m][i]);
            system('bufferize').run(self.stages[m][i]);
        }
    }
}