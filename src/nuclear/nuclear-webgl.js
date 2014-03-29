function Webgl_Image(entity, data){
    var gl = data.gl;

    this.image = data.image;
    this.gl = gl;
    this.program = data.program;
    this.texture = data.texture || gl.createTexture();
    this.buffer = data.buffer || gl.createBuffer();
    this.renderBuffer = data.renderBuffer || gl.createBuffer();
    this.bufferData = data.bufferData || new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]);

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
}

Webgl_Image.prototype.draw = function(x, y, width, height, array){
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    array[0] = x1;
    array[1] = y1;
    array[2] = x2;
    array[3] = y1;
    array[4] = x1;
    array[5] = y2;
    array[6] = x1;
    array[7] = y2;
    array[8] = x2;
    array[9] = y1;
    array[10] = x2;
    array[11] = y2;

    this.gl.bufferData(this.gl.ARRAY_BUFFER, array, this.gl.STATIC_DRAW);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}

function renderImage(entity, scene){
    var gl = this.webgl_image.gl,
        texture = this.webgl_image.texture,
        buffer = this.webgl_image.buffer,
        program = this.webgl_image.program,
        renderBuffer = this.webgl_image.renderBuffer,
        array = this.webgl_image.bufferData;
        position = this.position,
        size = this.size,
        cameraPosition = scene.cameraPosition;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, 1280, 768);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, renderBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    this.webgl_image.draw(position.x - cameraPosition.x, position.y - cameraPosition.y, size.width, size.height, renderImage.floatArray);
}

renderImage.floatArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

module.exports = function(){
    component.define('webgl_image', function(entity, data){
        return new Webgl_Image(entity, data);
    });

    system.define('webgl_image', ['position','size','webgl_image'] , renderImage);
    entity.define('webgl_image', {
        components : ['size', 'position', 'webgl_image']
    });
}