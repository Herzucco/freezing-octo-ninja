var images = require('../config/manifest')["images"];
var c      = require('../config/constantes');
scene.define('webgl', function(){
    var buffer = document.createElement('canvas');
    buffer.width = images['tree'].width;
    buffer.height = images['tree'].height;

    var bc = buffer.getContext('2d');
    bc.drawImage(images['tree'], 0, 0, images['tree'].width, images['tree'].height);

    var v = entity('drawShare').create({
        size :{
            width : 50,
            height : 50
        },
        position : {
            x : -c.MAP_SIZE/2
        }
    });
    component('draw').add(v, {
        image : buffer
    });
    // component('velocity').add(v, {
    //     x : Math.random()*2,
    //     y : Math.random()*2
    // });
    // for(var i = 0; i < 2000; i++){
    //     var x = entity('drawShare').create({
    //         size :
    //         {
    //             width : 50,
    //             height : 50
    //         },
    //         position : {
    //             x : -c.MAP_SIZE/2
    //         }
    //     });
    //     component('draw').share(v, x);
    //     component('velocity').add(x, {
    //         x : Math.random()*2,
    //         y : Math.random()*2
    //     });
    // }
});


// // look up where the vertex data needs to go.
    // var positionLocation = gl.getAttribLocation(program, "a_position");

    // // look up where the texture coordinates need to go.
    // var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // // provide texture coordinates for the rectangle.
    // var texCoordBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    //   0.0,  0.0,
    //   1.0,  0.0,
    //   0.0,  1.0,
    //   0.0,  1.0,
    //   1.0,  0.0,
    //   1.0,  1.0]), gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(texCoordLocation);
    // gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // // Create a texture.
    // var texture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);

    // // Set the parameters so we can render any size image.
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // // Upload the image into the texture.
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, manifest.images['grass']);

    // // lookup uniforms
    // var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // // set the resolution
    // gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // // Create a buffer for the position of the rectangle corners.
    // var buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.enableVertexAttribArray(positionLocation);
    // gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // // Set a rectangle the same size as the image.
    // setRectangle(gl, 0, 0, 128, 128);

    // gl.drawArrays(gl.TRIANGLES, 0, 6);