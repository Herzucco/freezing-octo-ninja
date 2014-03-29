require('../nuclear/nuclear-a-star')();
var c      = require('../config/constantes');
var images = require('../config/manifest')["images"];
scene.define('potato', function(){
    var slot = this.slot;
    var slotEntity = this.grid.tiles[slot];
    var slotCenter = component('center').of(slotEntity);
    var x = entity('finder').create({
        size :
        {
            width : 64,
            height : 96
        },
        draw :
        {
            image : images['patateAnim'],
            frameSize : {
                width : 64,
                height : 96
            },
            offset : {
                x : 32,
                y : 75
            }
        },
        layer : {
            layer : 10
        },
        relayerize : {
            base : 10,
            step : 1
        },
        position : {
            x : slotCenter.x-1,
            y : slotCenter.y-1
        },
        a_star : {
            index : slot,
            board : this.grid.board,
            tiles : this.grid.tiles
        },
        ia_goto : {
            target : [],
            speed : 1
        },
        animation : {
            animations : {
                one : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 0
                    },
                    fps : 10
                },
                two : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 96
                    },
                    fps : 10
                },
                three : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 192
                    },
                    fps : 10
                },
                four : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 288
                    },
                    fps : 10
                },
                five : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 384
                    },
                    fps : 10
                },
                six : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 480
                    },
                    fps : 10
                },
                seven : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 576
                    },
                    fps : 10
                },
                eight : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 672
                    },
                    fps : 10
                },
                nine : {
                    run : "horizontal",
                    numberOfFrames : 4,
                    size : {
                        width : 64,
                        height : 96
                    },
                    start : {
                        x : 64,
                        y : 672
                    },
                    fps : 10
                },
            },
            currentAnimation : "two"
        }
    });
    var as = component('a_star').of(x);
    component.on('animation:change:'+x, function(velocity){
        if(velocity.x === 0 && velocity.y < 0){
            component('animation').of(x).currentAnimation = 'five';
        }
        else if(velocity.x > 0 &&  velocity.x < 0.25 && velocity.y > 0 && velocity.x < 0.25){
            component('animation').of(x).currentAnimation = 'eight';
        }
        else if(velocity.x > 0.25 &&  velocity.x < 1 && velocity.y === 0){
            component('animation').of(x).currentAnimation = 'six';
        }
        else if(velocity.x < 0 && velocity.y > 0){
            component('animation').of(x).currentAnimation = 'one';
        }
        else if(velocity.x < 0 && velocity.y > 0){
            component('animation').of(x).currentAnimation = 'one';
        }
        else if(velocity.x < 0 && velocity.y > 0){
            component('animation').of(x).currentAnimation = 'one';
        }
    });
    as.findWay(Math.round(Math.random()*500));
});