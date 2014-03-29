scene.define('keyboard', function(){
    document.addEventListener('keydown', function(e){
        if(e.keyCode === 81){
            scene.trigger("cameraTest:left");
        }else if(e.keyCode === 90){
            scene.trigger("cameraTest:up");
        }else if(e.keyCode === 83){
            scene.trigger("cameraTest:down");
        }else if(e.keyCode === 68){
            scene.trigger("cameraTest:right");
        }else if(e.keyCode === 69){
            scene.trigger("stagesManager:up");
        }else if(e.keyCode === 82){
            scene.trigger("stagesManager:down");
        }
    });
    document.addEventListener('keyup', function(e){
        if(e.keyCode === 81 || e.keyCode === 90 ||
            e.keyCode === 83 || e.keyCode === 68){
           scene.trigger("cameraTest:stop");
        }
    });
});