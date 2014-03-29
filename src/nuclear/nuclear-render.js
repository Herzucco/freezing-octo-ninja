module.exports = function(){
    entity.define('box', {
        components : ['render', 'position', 'size', 'rotation', 'layer']
    });

    entity.define('bufferedBox', {
        components : ['buffer', 'position', 'size', 'rotation', 'layer']
    });

    entity.define('bufferedPolygon', {
        components : ['buffer', 'position', 'points', 'rotation', 'layer']
    });

    entity.define('draw', {
        components : ['draw', 'position', 'size', 'layer']
    });

    entity.define('drawShare', {
        components : ['position', 'size', 'layer']
    });

    component.define('render', function(entity, data){
        return {
            stroke : data.stroke || "blue",
            fill : data.fill,
            width : data.width || 5
        }
    });

    component.define('relayerize', function(entity, data){
        return {
            base : data.base || 0,
            step : data.step
        }
    });
    component.define('draw', function(entity, data) {
        return {
            image : data.image || null
        }
    });

    component.define('layer', function (data) {
        return {
            layer : data.layer || 0
        };
    });

    component.define('buffer', function(entity, data){
        return {
            data : data,
            type : data.type || 'draw'
        }
    });

    component.define("animation", function(entity, data){
        var component = {
            Animations : {},
            currentAnimation : data.currentAnimation,
            pause : data.pause || false,
            count : 0,
            currentFrame : data.currentFrame || 0
        };
        for(var i in data.animations){
            component.Animations[i] = [];
            var basePosition = data.animations[i].start;
            for(var o = 0; o < data.animations[i].numberOfFrames; o++){
                if(data.animations[i].run === "horizontal"){
                    component.Animations[i].push([
                        basePosition.x+(o*(data.animations[i].size.width)),
                        basePosition.y,
                        data.animations[i].size,
                        data.animations[i].fps
                    ]);
                }else{
                    component.Animations[i].push([
                        basePosition.x,
                        basePosition.y+(o*(data.animations[i].size.height)),
                        data.animations[i].size,
                        data.animations[i].fps
                    ]);
                }
            }
        }

        return component;
    });

    system.define("animate", ["animation", "draw"], function(){
        var animation = this.animation;
        var draw = this.draw;
        var currentAnimation = animation.Animations[animation.currentAnimation];
        var currentFrame = currentAnimation[animation.currentFrame];
        if(!animation.pause){
            animation.count += currentFrame[3] / 60;

            if(animation.count>=1){
                animation.count = 0;
                animation.currentFrame++;
                if(currentAnimation.length <= animation.currentFrame){
                    animation.currentFrame = 0;
                }
            }
        }

        draw.animationPosition.x = currentFrame[0];
        draw.animationPosition.y = currentFrame[1];

        draw.frameSize.width = currentFrame[2].width;
        draw.frameSize.height = currentFrame[2].height;
    });

    system.define('relayerize', ['layer','relayerize', 'position'], function(entity, scene){
        this.layer.layer = this.relayerize.base + Math.floor(this.position.y / this.relayerize.step);
    });

    system.define('privateSquareRender', ['position', 'size', 'render'], function (entity, scene) {
        var context = scene.context;
        var cameraPosition = scene.cameraPosition || {x : 0, y : 0};
        if (component('rotation').in(entity))
        {
            this.rotation = component('rotation').of(entity);
            context.save();
            context.translate((this.position.x - cameraPosition.x),
                                (this.position.y - cameraPosition.y));
            context.rotate(this.rotation.angle * Math.PI / 180);
            if(this.render.fill){
                context.fillStyle = this.render.fill;
                context.fillRect(-this.size.width/2,  -this.size.height/2, this.size.width, this.size.height);
            }
            if(this.render.stroke){
                context.strokeStyle = this.render.stroke;
                context.strokeRect(-this.size.width/2,  -this.size.height/2, this.size.width, this.size.height);
            }
            context.restore();
        }
        else
        {
            if(this.render.fill){
                context.fillStyle = this.render.fill;
                context.fillRect(this.position.x - cameraPosition.x, this.position.y - cameraPosition.y, this.size.width, this.size.height);
            }
            if(this.render.stroke){
                context.strokeStyle = this.render.stroke;
                context.strokeRect(this.position.x - cameraPosition.x, this.position.y - cameraPosition.y, this.size.width, this.size.height);
            }
        }
    }, {msPerUpdate : 16, strict : false});

    system.define('privatePointsRender', ['position', 'points', 'render'], function (entity, scene) {
        system('adaptPoints').run(entity);
        var context = scene.context;
        var cameraPosition = scene.cameraPosition || {x : 0, y : 0};
        var point = this.points.points[0];
        context.beginPath();
        context.moveTo(point.x-cameraPosition.x, point.y-cameraPosition.y);
        for(var i = 0; i < this.points.points.length; i++){
            point = this.points.points[i];
            if(i === this.points.points.length-1) var next = 0;
            else var next = i+1;

            next = this.points.points[next];
            context.lineTo(next.x-cameraPosition.x, next.y-cameraPosition.y);
        }
        if(this.render.fill){
            context.fillStyle = this.render.fill;
            context.fill();
        }
        if(this.render.stroke){
            context.lineWidth = this.render.width;
            context.strokeStyle = this.render.stroke;
            context.stroke();
        }
    }, {msPerUpdate : 16, strict : false, disable : ['adaptPoints']});

    system.define('privateDrawRender', ['position', 'size', 'draw'], function (entity, scene) {
        var context = scene.context;
        var cameraPosition = scene.cameraPosition || {x : 0, y : 0};

        context.save();
        if(component('scale').in(entity)){
            var scale = component('scale').of(entity);
            context.scale(scale.x, scale.y);
        }
        context.drawImage(this.draw.image, this.position.x - cameraPosition.x,
                            this.position.y - cameraPosition.y, this.size.width, this.size.height);
        context.restore();
    });

    system.define('bufferize', ['buffer'],function(entity, scene){
        component(this.buffer.type).add(entity, this.buffer.data);
        system('render').run(entity);
        component(this.buffer.type).remove(entity);
        component('buffer').disable(entity);
    }, {strict : false});

    system.define('render', ['layer'], function (entity, scene) {
       system('privateDrawRender').run(entity);
       system('privateSquareRender').run(entity);
       system('privatePointsRender').run(entity);
    }, {msPerUpdate : 16, strict : false, disable : ['privateSquareRender', 'privateDrawRender', 'privatePointsRender']});

    system('render').autosort(function(a, b){
        var aRender = component('layer').of(a);
        var bRender = component('layer').of(b);

        return aRender.layer - bRender.layer;
    });
}