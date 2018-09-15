function Stars() {

  this.init = function(){
    var body = this.body = mrchan.storage.d3body;
    this.dots = mrchan.storage.dots = [];
    this.lines = mrchan.storage.lines = [];
    var options = this.options = mrchan.config.stars;
    this.density = options.density;
    var porps = this.porps = body.node().getBoundingClientRect();
    /*this.plane = body.append('svg')
      .attr('width', porps.width)
      .attr('height', porps.height)
      .attr('id', 'plane');*/
    this.plane = body.append('div')
      .attr('id', 'plane');
    this.blinkIn = function() {
      return d3.transition()
        .duration(250)
        .ease(d3.easeLinear);
    }
    this.slowBlink = function() {
      return d3.transition()
        .duration(1500)
        .ease(d3.easeLinear);
    }
    this.onOpacity = options.onOpacity;
    this.medOpacity = options.medOpacity;
    this.offOpacity = options.offOpacity;
    this.lineOpacity = options.lineOpacity;
    this.mousePos = {'x': -1000, 'y': -1000}
    this.create_dots();
    //if(mrchan.config.lowspec)this.plane.style('opacity', 0);
  }

  this.scale = function() {
    var porps = this.body.node().getBoundingClientRect();
    if(this.timeout)clearTimeout(this.timeout)
    this.timeout = setTimeout(this._scale.bind(this),500)
  }

  this._scale = function(){
    // var oldPorps = this.plane.node().getBoundingClientRect();
    // var porps = this.body.node().getBoundingClientRect();
    // var newDots = [];
    // if(porps.height>oldPorps.height){
    //   this.plane.style('height', porps.height+'px');
    //   var dotsHoriz = Math.floor(oldPorps.width * this.density);
    //   var dotsVert = Math.floor((porps.height - oldPorps.height) * this.density);
    //   for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
    //     var x = Math.random()*porps.width;
    //     var y = Math.random()*(porps.height - oldPorps.height)+oldPorps.height;
    //     var star = this.starfield.append('circle')
    //       .attr('id', 'star'+i)
    //       .attr('cx', x)
    //       .attr('cy', y)
    //       .classed('star', true)
    //     star.transition(mrchan.transitions.fadeIn)
    //       .style('opacity', this.offOpacity);
    //     var dot = {
    //       'star': star,
    //       'x': x,
    //       'y':y,
    //       'opacity': this.offOpacity,
    //       'lined': false,
    //       'targeted': []
    //     };
    //     this.dots.push(dot);
    //     newDots.push(dot);
    //   }
    // }
    // if(porps.width>oldPorps.width){
    //   this.plane.style('width', porps.width+'px');
    //   var dotsHoriz = Math.floor((porps.width - oldPorps.width) * this.density);
    //   var dotsVert = Math.floor(porps.height * this.density);
    //   for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
    //     var x = Math.random()*(porps.width - oldPorps.width)+oldPorps.width;
    //     var y = Math.random()*porps.height;
    //     var star = this.starfield.append('circle')
    //       .attr('id', 'star'+i)
    //       .attr('cx', x)
    //       .attr('cy', y)
    //       .classed('star', true)
    //     star.transition(mrchan.transitions.fadeIn)
    //       .style('opacity', this.offOpacity);
    //     var dot = {
    //       'star': star,
    //       'x': x,
    //       'y':y,
    //       'opacity': this.offOpacity,
    //       'lined': false,
    //       'targeted': []
    //     };
    //     this.dots.push(dot);
    //     newDots.push(dot);
    //   }
    // }
    // for(var i = 0; i<newDots.length; i++){
    //   var dot = newDots[i]
    //   dot.line = this.linefield.append('svg:line')
    //     .attr('x1', dot.x)
    //     .attr('y1', dot.y)
    //     .attr('x2', dot.x)
    //     .attr('y2', dot.y)
    //     .classed('constellation', true);
    //   var coord = this.pick_dot(dot.x, dot.y, 100);
    //   dot.x2 = coord.x;
    //   dot.y2 = coord.y;
    //   if(coord.star) dot.target = coord;
    //   this.lines.push(dot.line);
    // }
  }

  this.create_dots = function(){
    var plane = this.plane;
    var porps = this.porps;
    var starfield = this.starfield = plane.append('canvas')
      .attr('width', porps.width)
      .attr('height', porps.height)
      .attr('id', 'starfield');
    var linefield = this.linefield = plane.append('div')
      .attr('id', 'linefield');
    var dotsHoriz = Math.floor(porps.width * this.density);
    var dotsVert = Math.floor(porps.height * this.density);
    this.body.on('mousemove',this.movement.bind(this));
    var starctx = starfield.node().getContext('2d');
    starctx.fillStyle = "rgba(221, 221, 221, "+this.offOpacity+")";
    for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
      var x = Math.random()*porps.width;
      var y = Math.random()*porps.height;
      /*var star = starfield.append('circle')
        .attr('id', 'star'+i)
        .attr('cx', x)
        .attr('cy', y)
        .classed('star', true);*/
      starctx.beginPath();
      starctx.arc(x, y, 1, 0, 2*Math.PI)
      starctx.fill();
      /*star.transition(mrchan.transitions.fadeIn)
        .style('opacity', this.offOpacity);*/
      this.dots.push({
        //'star': star,
        'star': true,
        'x': x,
        'y':y,
        'opacity': this.offOpacity,
        'lined': false,
        'targeted': []
      });
    }
    for(var i = 0; i<this.dots.length; i++){
      /*var dot = this.dots[i]
      dot.line = this.linefield.append('canvas')
        .attr('x1', dot.x)
        .attr('y1', dot.y)
        .attr('x2', dot.x)
        .attr('y2', dot.y)
        .classed('constellation', true);
      var coord = this.pick_dot(dot.x, dot.y, 100);
      dot.x2 = coord.x;
      dot.y2 = coord.y;
      if(coord.star) dot.target = coord;*/

      var dot = this.dots[i];
      var coord = this.pick_dot(dot.x, dot.y, 100);
      var left = dot.x<coord.x ? dot.x-2 : coord.x-2;
      var top = dot.y<coord.y ? dot.y-2 : coord.y-2;
      var width = dot.x<coord.x ? coord.x-dot.x+4 : dot.x-coord.x+4;
      var height = dot.y<coord.y ? coord.y-dot.y+4 : dot.y-coord.y+4;
      var line = this.linefield.append('canvas')
        .style('left', left+'px')
        .style('top', top+'px')
        .attr('width', width)
        .attr('height', height)
        .classed('constellation', true);
      dot.line = {
        'canvas': line,
        'dot1': {'x': dot.x-left, 'y': dot.y-top},
        'dot2': {'x': coord.x-left, 'y': coord.y-top},
        'onOpacity': this.onOpacity,
        'offOpacity': this.offOpacity,
        'percent': 0,
        'turnon': function(time) {
          var duration = 250;
          if(this.currentanimation && this.currentanimation != 'turnon'){
            this.startTime = 2*time-duration-this.startTime;
          }
          this.currentanimation = 'turnon';
          if(!this.startTime)this.startTime = time;
          dot.opacity = this.onOpacity;
          var percent = (time-this.startTime)/250;
          percent = percent<1 ? percent : 1;
          // star opacity, radius, line length
          var staropacity = (this.onOpacity-this.offOpacity)*percent+this.offOpacity;
          var starradius = (2-1)*percent+1;
          var lineend = {
            'x': (this.dot2.x-this.dot1.x)*percent+this.dot1.x,
            'y': (this.dot2.y-this.dot1.y)*percent+this.dot1.y
          }
          var linectx = this.canvas.node().getContext('2d');
          linectx.clearRect(0, 0, this.canvas.node().width, this.canvas.node().height);
          linectx.fillStyle = "rgba(221, 221, 221, "+staropacity+")";
          linectx.strokeStyle = "rgba(221, 221, 221, "+staropacity+")";
          linectx.beginPath();
          linectx.arc(this.dot1.x, this.dot1.y, starradius, 0, 2*Math.PI);
          linectx.fill();
          linectx.beginPath();
          linectx.arc(this.dot2.x, this.dot2.y, starradius, 0, 2*Math.PI);
          linectx.fill();
          linectx.beginPath();
          linectx.moveTo(this.dot1.x, this.dot1.y);
          linectx.lineTo(lineend.x, lineend.y);
          linectx.stroke();
          this.percent = percent;
          if(percent == 1){
            delete this.startTime;
            delete this.currentanimation;
          }
        },
        'turnoff': function(time) {
          var duration = 250;
          console.log('to')
          if(this.currentanimation && this.currentanimation != 'turnoff'){
            this.startTime = 2*time-duration-this.startTime;
          }
          this.currentanimation = 'turnoff';
          if(!this.startTime)this.startTime = time;
          dot.opacity = this.offOpacity;
          var percent = (time-this.startTime)/250;
          percent = percent<1 ? percent : 1;
          // star opacity, radius, line length
          var staropacity = (this.offOpacity-this.onOpacity)*percent+this.onOpacity;
          var starradius = (1-2)*percent+2;
          var lineend = {
            'x': (this.dot1.x-this.dot2.x)*percent+this.dot2.x,
            'y': (this.dot1.y-this.dot2.y)*percent+this.dot2.y
          }
          var linectx = this.canvas.node().getContext('2d');
          linectx.clearRect(0, 0, this.canvas.node().width, this.canvas.node().height);
          linectx.fillStyle = "rgba(221, 221, 221, "+staropacity+")";
          linectx.strokeStyle = "rgba(221, 221, 221, "+staropacity+")";
          linectx.beginPath();
          linectx.arc(this.dot1.x, this.dot1.y, starradius, 0, 2*Math.PI);
          linectx.fill();
          linectx.beginPath();
          linectx.arc(this.dot2.x, this.dot2.y, starradius, 0, 2*Math.PI);
          linectx.fill();
          linectx.beginPath();
          linectx.moveTo(this.dot1.x, this.dot1.y);
          linectx.lineTo(lineend.x, lineend.y);
          linectx.stroke();
          this.percent = 1-percent;
          if(percent == 1){
            delete this.startTime;
            delete this.currentanimation;
          }
        }
      }

      this.lines.push(dot.line);
    }

    window.requestAnimationFrame(this.animate_lines.bind(this));
    //this.blinkage();
  }

  this.animate_lines = function(time) {
    for(var i = 0; i<mrchan.storage.dots.length; i++){
      var dot = mrchan.storage.dots[i];
      if(Math.pow(dot.x-this.mousePos.x,2)+Math.pow(dot.y-this.mousePos.y,2)<5000){
        //if(mrchan.config.lowspec)continue;
        if(dot.opacity!==this.onOpacity && dot.line.percent<1){
          dot.line.turnon(time);
        }
      }else{
        if(dot.opacity===this.onOpacity && dot.line.percent>0){
          dot.line.turnoff(time);
        }
      }
    }
    window.requestAnimationFrame(this.animate_lines.bind(this));
  }

  this.pick_dot = function(x,y,range){
    for(var i = 0; i<this.dots.length; i++){
      var ret = this.dots[Math.floor(Math.random()*this.dots.length)];
      if(Math.abs(ret.x-x)<range && Math.abs(ret.y-y)<range)return ret;
    }
    return {
      'x': x,
      'y': y
    };
  }

  this.movement = function(el,hi,me,clear){
    if(me&&me[hi])var coords = d3.mouse(me[hi]);
    if(clear)coords=[-1000,-1000];
    this.mousePos = {
      'x': coords[0],
      'y': coords[1]
    }
  }

  this.blinkage = function(){
    // if(!mrchan.config.lowspec){
    //   var target = this.dots[Math.floor(Math.random()*this.dots.length)];
    //   if(target.opacity===this.offOpacity){
    //     target.opacity=this.medOpacity;
    //     target.star.transition(this.slowBlink())
    //       .style('opacity', this.medOpacity)
    //       .style('r', 2);
    //     setTimeout(function(){
    //       if(target.opacity!==this.offOpacity && !target.lined && target.targeted.length===0){
    //         target.opacity = this.offOpacity;
    //         target.star.transition(this.slowBlink())
    //           .style('opacity', this.offOpacity)
    //           .style('r', 1);
    //       }
    //     }.bind(this), 2000);
    //   }
    // }
    // setTimeout(this.blinkage.bind(this), Math.floor(Math.random()*500)+500);
  }

  this.clearage = function(){
    this.movement(null, null, null, true);
  }
}

mrchan.viewStore.Stars = Stars;