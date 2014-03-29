var maths = require('../../lib/maths');
module.exports = function(){
    component.define('position', function (data) {
        return {
            x : data.x || 0, y : data.y || 0
        };
    });

    component.define('velocity', function (entity, data) {
        return {
            x : data.x || 0, y : data.y || 0, limit : data.limit || 0
        };
    });

    component.define('center', function(entity, data) {
        return {
            x : data.x || 0, y : data.y || 0
        }
    });

    component.define('scale', function(entity, data) {
        return {
            x : data.x || 0, y : data.y || 0
        }
    });

    component.define('points', function(entity, data) {
        return {
            points : data.points || []
        }
    });

    component.define('limitPosition', function(entity, data){
        return {
            minX : data.minX || 0,
            minY : data.minY || 0,
            maxX : data.maxX || 0,
            maxY : data.maxY || 0
        }
    });

    component.define('acceleration', function (data) {
        function AccelerationComponent(x, y, friction){
            maths.Vector.call(this, x, y);
            this.friction = friction;
        }
        AccelerationComponent.prototype = new maths.Vector();
        AccelerationComponent.prototype.addForce = function(force){
            this.x += force.x;
            this.y += force.y;
        }
        var component = new AccelerationComponent(data.x || 0, data.y || 0, data.friction || 0);
        return component;
    });

    component.define('size', function (data) {
        return {
            width : data.width || 0, height : data.height || 0
        };
    });

    component.define('radius', function (data) {
        return {
            radius : data.radius || 0, circumference : 2
        };
    });

    component.define('rotation', function(data) {
        return {
            angle : data.angle || 0
        }
    });

    component.define('gravity', function (entity, data) {
        return {
            x : data.x || 0, y : data.y || 0
        };
    });

    component.define('spring', function (entity, data) {
        return {
            anchor : data.anchor || {x : 0, y : 0}, k : data.k || 0,
            length : data.length || 0, render :data.render || false
        };
    });

    system.define('kinematic', ['position', 'velocity'], function (entity) {
        if(this.velocity.limit){
            var limited = maths.vectors.limit(this.velocity, this.velocity.limit);
            this.velocity.x = limited.x;
            this.velocity.y = limited.y;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(component('limitPosition').in(entity)){
            this.limit = component('limitPosition').of(entity);
            if(this.limit.minX > this.position.x)
                this.position.x = this.limit.minX >> 0;
            else if(this.limit.maxX < this.position.x)
                this.position.x = this.limit.maxX >> 0;

            if(this.limit.minY > this.position.y)
                this.position.y = this.limit.minY >> 0;
            else if(this.limit.maxY < this.position.y)
                this.position.y = this.limit.maxY >> 0;
        }

    }, {msPerUpdate : 16, strict : false});

    system.define('acceleration', ['acceleration', 'velocity'], function () {
        var friction = this.velocity;
        if(maths.vectors.magnitude(friction) !== 0){
            friction = maths.vectors.mult(friction, -1);
            friction = maths.vectors.normalize(friction);
            friction = maths.vectors.mult(friction, this.acceleration.friction);

            this.acceleration.addForce(friction);
        }

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.acceleration.mult(0);
    }, {msPerUpdate : 16, strict : false});

    system.define('spring', ['spring', 'position', 'acceleration'], function () {
        var force = maths.vectors.sub(this.position, this.spring.anchor);
        var d = maths.vectors.magnitude(force);
        var stretch = d - this.spring.length;

        force = maths.vectors.normalize(force);
        force = maths.vectors.mult(force, -1 * this.spring.k * stretch);

        this.acceleration.addForce(force);
    });

    system.define('adaptPoints', ['points', 'position'], function () {
        var points = this.points.points;
        for(var i = 0; i < points.length; i++){
            var point = points[i];
            point.x = this.position.x + point.relativeX;
            point.y = this.position.y + point.relativeY;
        }
    });

    system.define('gravity', ['gravity', 'acceleration'], function () {
        this.acceleration.addForce(this.gravity);
    });
}