var iso = require('../../lib/maths').iso;
var c      = require('../config/constantes');
var images = require('../config/manifest')["images"];
var maths = require('../../lib/maths');
scene.define('testHighness', function() {
    var x = this.x;
    var y = this.y;
    var buffer    = document.createElement('canvas');
    buffer.width  = 100;
    buffer.height = 90;
    document.body.appendChild(buffer);
    this.context = buffer.getContext('2d');
    this.render = buffer;
    entity('bufferedPolygon').create({
        position : {
            x : x,
            y : y
        },
        points : {
            points : [
                {
                    relativeX : -50,
                    relativeY : 0
                },
                {
                    relativeX : 0,
                    relativeY : -25
                },
                {
                    relativeX : 50,
                    relativeY : 0
                },
                {
                    relativeX : 0,
                    relativeY : 25
                },
            ]
        },
        buffer : {
            stroke : 'black',
            fill : this.colors[0],
            type : 'render',
            width : 0.1
        }
    });

    entity('bufferedPolygon').create({
        position : {
            x : x - 25,
            y : y + 5
        },
        points : {
            points : [
                {
                    relativeX : -25,
                    relativeY : -5
                },
                {
                    relativeX : 25,
                    relativeY : 20
                },
                {
                    relativeX : 25,
                    relativeY : 60
                },
                {
                    relativeX : -25,
                    relativeY : 35
                },
            ]
        },
        buffer : {
            stroke : 'black',
            fill : this.colors[1],
            type : 'render',
            width : 0.1
        }
    });

    entity('bufferedPolygon').create({
        position : {
            x : x - 25,
            y : y + 5
        },
        points : {
            points : [
                {
                    relativeX : 25,
                    relativeY : 20
                },
                                {
                    relativeX : 75,
                    relativeY : -5
                },
                {
                    relativeX : 75,
                    relativeY : 35
                },
                {
                    relativeX : 25,
                    relativeY : 60
                },
            ]
        },
        buffer : {
            stroke : 'black',
            fill : this.colors[1],
            type : 'render',
            width : 0.1
        }
    });
});