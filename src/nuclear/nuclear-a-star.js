var maths = require('../../lib/maths');
module.exports = function(){
    entity.define('finder', {
        components : ['position', 'velocity', 'ia_goto', 'a_star', 'draw', 'size', 'layer', 'animation', 'relayerize']
    });
    component.define('ia_goto', function(id, data){
        function GoTo(target, speed){
            if(!Array.isArray(target)) target = [target];

            this.target = target;
            this.speed = speed;
            this.currentIndex = 0;
        }
        GoTo.prototype.computeNext = function(position){
            if(this.target.length === 0){
                return false;
            }
            var target = this.target[0];
            var direction = maths.vectors.sub(component('center').of(target), position);
            return maths.vectors.mult(maths.vectors.normalize(direction), this.speed);
        }
        return new GoTo(data.target || {x : 0, y : 0}, data.speed || 0);
    });

    component.define('a_star', function(entity, data){
        function A_star(entity, data){
            this.entity = entity,
            this.board = data.board;
            this.tiles = data.tiles;

            var height = this.board.length;
            var currentBoardIndex = {
                x : Math.floor(data.index / height),
                y : data.index % height
            };
            this.currentBoardIndex = currentBoardIndex;
            this.currentDestination = data.destination || 0;
            this.wayPoints = [];
        }
        A_star.prototype.findWay = function(index){
            this.currentDestination = index;
            var height = this.board.length;
            var destinationBoardIndex = {
                x : Math.floor(index / height),
                y : index % height
            };
            this.lastDestination = destinationBoardIndex;
            var targets = [];
            var path = a_star([this.currentBoardIndex.x, this.currentBoardIndex.y],
                                [destinationBoardIndex.x,destinationBoardIndex.y],
                                 this.board, this.board.length, this.board.length, true);
            this.wayPoints.length = 0;
            for(var i = 0; i < path.length; i++){
                var node = path[i];
                var index = node.x*this.board.length+node.y;
                targets[i] = this.tiles[index];
                this.wayPoints[this.tiles[index]] = index;
            };
            component('ia_goto').of(this.entity).target = targets;
        }


        var c = new A_star(entity, data);
        component.on('a_star:change', function(index){
            this.findWay(this.currentDestination);
        }, {
            context : c
        });

        component.on('a_star:reach:'+c.entity, function(id){
            var index = this.wayPoints[id];
            var height = this.board.length;
            var currentBoardIndex = {
                x : Math.floor(index / height),
                y : index % height
            };
            this.currentBoardIndex = currentBoardIndex;
            // this.board[currentBoardIndex.x][currentBoardIndex.y] = 1;
            // this.board[this.lastDestination.x][this.lastDestination.y] = 0;
            // component.trigger('a_star:change');
        }, {
            context : c
        });
        return c;
    });

    system.define('ia_goto', ['ia_goto', 'velocity', 'position'], function (entity, scene) {
        var direction = this.ia_goto.computeNext(this.position);
        if(direction){
            this.velocity.x = direction.x;
            this.velocity.y = direction.y;
        } else{
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        
        if(this.ia_goto.target.length){
            var place = component('center').of(this.ia_goto.target[0]);
            if(this.position.x <= place.x + this.ia_goto.speed  && this.position.x >= place.x - this.ia_goto.speed  &&
                this.position.y <= place.y + this.ia_goto.speed  && this.position.y >= place.y - this.ia_goto.speed){
                component.trigger('a_star:reach:'+entity, this.ia_goto.target[0]);
                var direction = this.ia_goto.computeNext(this.position);
                this.ia_goto.target.splice(0,1);
                component.trigger('animation:change:'+entity, direction);
            }
        }
    }, {msPerUpdate : 16, strict : false});
}