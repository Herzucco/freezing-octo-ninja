module.exports = function(){
    entity.define('camera', {
        components : ['position', 'velocity', 'acceleration']
    });
}