module.exports = function(){
    entity.define('tile', {
        components : ['position', 'size', 'buffer', 'layer']
    });

    entity.define('virtualTile', {
        components : ['position', 'size']
    });
}