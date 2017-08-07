function DotView() {

  this.init = function(){
    var body = this.body = mrchan.storage.d3body;
    this.dots = mrchan.storage.dots = [];
    this.lines = mrchan.storage.lines = [];
    var options = this.options = mrchan.config.stars;
    this.density = options.density;
    var porps = this.porps = body.node().getBoundingClientRect();
    this.plane = body.append('svg')
      .attr('width', porps.width)
      .attr('height', porps.height)
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
    this.create_dots();
  }

  this.scale = function() {
    var porps = this.body.node().getBoundingClientRect();
    /*if(porps.height<500 || porps.width<400){
      if(this.wasBig){
        this.wasBig = false;
        this.saveSpec = mrchan.config.lowspec;
        mrchan.config.lowspec = true;
      }
    }else{
      if(!this.wasBig){
        mrchan.config.lowspec = this.saveSpec || mrchan.config.lowspec;
      }
      this.wasBig = true;
    }*/
    if(this.timeout)clearTimeout(this.timeout)
    this.timeout = setTimeout(this._scale.bind(this),500)
  }

  this._scale = function(){
    var oldPorps = this.plane.node().getBoundingClientRect();
    var porps = this.body.node().getBoundingClientRect();
    var newDots = [];
    if(porps.height>oldPorps.height){
      this.plane.style('height', porps.height+'px');
      var dotsHoriz = Math.floor(oldPorps.width * this.density);
      var dotsVert = Math.floor((porps.height - oldPorps.height) * this.density);
      for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
        var x = Math.random()*porps.width;
        var y = Math.random()*(porps.height - oldPorps.height)+oldPorps.height;
        var star = this.starfield.append('circle')
          .attr('id', 'star'+i)
          .attr('cx', x)
          .attr('cy', y)
          .classed('star', true)
        star.transition(mrchan.transitions.fadeIn)
          .style('opacity', this.offOpacity);
        var dot = {
          'star': star,
          'x': x,
          'y':y,
          'opacity': this.offOpacity,
          'lined': false,
          'targeted': []
        };
        this.dots.push(dot);
        newDots.push(dot);
      }
    }
    if(porps.width>oldPorps.width){
      this.plane.style('width', porps.width+'px');
      var dotsHoriz = Math.floor((porps.width - oldPorps.width) * this.density);
      var dotsVert = Math.floor(porps.height * this.density);
      for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
        var x = Math.random()*(porps.width - oldPorps.width)+oldPorps.width;
        var y = Math.random()*porps.height;
        var star = this.starfield.append('circle')
          .attr('id', 'star'+i)
          .attr('cx', x)
          .attr('cy', y)
          .classed('star', true)
        star.transition(mrchan.transitions.fadeIn)
          .style('opacity', this.offOpacity);
        var dot = {
          'star': star,
          'x': x,
          'y':y,
          'opacity': this.offOpacity,
          'lined': false,
          'targeted': []
        };
        this.dots.push(dot);
        newDots.push(dot);
      }
    }
    for(var i = 0; i<newDots.length; i++){
      var dot = newDots[i]
      dot.line = this.linefield.append('svg:line')
        .attr('x1', dot.x)
        .attr('y1', dot.y)
        .attr('x2', dot.x)
        .attr('y2', dot.y)
        .classed('constellation', true);
      var coord = this.pick_dot(dot.x, dot.y, 100);
      dot.x2 = coord.x;
      dot.y2 = coord.y;
      if(coord.star) dot.target = coord;
      this.lines.push(dot.line);
    }
  }

  this.create_dots = function(){
    var plane = this.plane;
    var porps = this.porps;
    var starfield = this.starfield = plane.append('g');
    var linefield = this.linefield = plane.append('g');
    var dotsHoriz = Math.floor(porps.width * this.density);
    var dotsVert = Math.floor(porps.height * this.density);
    plane.on('mousemove',this.movement.bind(this));
    for(var i = 0; i<dotsHoriz*dotsVert && i<mrchan.config.stars.maxStars; i++){
      var x = Math.random()*porps.width;
      var y = Math.random()*porps.height;
      var star = starfield.append('circle')
        .attr('id', 'star'+i)
        .attr('cx', x)
        .attr('cy', y)
        .classed('star', true);
      star.transition(mrchan.transitions.fadeIn)
        .style('opacity', this.offOpacity);
      this.dots.push({
        'star': star,
        'x': x,
        'y':y,
        'opacity': this.offOpacity,
        'lined': false,
        'targeted': []
      });
    }
    for(var i = 0; i<this.dots.length; i++){
      var dot = this.dots[i]
      dot.line = this.linefield.append('svg:line')
        .attr('x1', dot.x)
        .attr('y1', dot.y)
        .attr('x2', dot.x)
        .attr('y2', dot.y)
        .classed('constellation', true);
      var coord = this.pick_dot(dot.x, dot.y, 100);
      dot.x2 = coord.x;
      dot.y2 = coord.y;
      if(coord.star) dot.target = coord;
      this.lines.push(dot.line);
    }
    this.blinkage();
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
    for(var i = 0; i<mrchan.storage.dots.length; i++){
      var dot = mrchan.storage.dots[i];
      if(Math.pow(dot.x-coords[0],2)+Math.pow(dot.y-coords[1],2)<5000){
        if(mrchan.config.lowspec)continue;
        if(dot.opacity!==this.onOpacity){
          dot.opacity=this.onOpacity;
          dot.star.transition(this.blinkIn())
            .style('opacity', this.onOpacity)
            .style('r', 2);
        }
        if(!dot.lined){
          dot.lined = true;
          dot.line.transition(this.blinkIn())
            .attr('x2', dot.x2)
            .attr('y2', dot.y2)
            .style('opacity', this.lineOpacity);
          if(dot.target){
            dot.target.targeted.push(dot);
            if(dot.target.opacity!==this.onOpacity){
              dot.target.opacity=this.onOpacity;
              dot.target.star.transition(this.blinkIn())
                .style('opacity', this.onOpacity)
                .style('r', 2);
            }
          }
        }
      }else{
        if(dot.opacity===this.onOpacity && dot.targeted.length==0){
          dot.opacity=this.offOpacity;
          dot.star.transition(this.blinkIn())
            .style('opacity', this.offOpacity)
            .style('r', 1);
        }
        if(dot.lined){
          dot.lined = false;
          dot.line.transition(this.blinkIn())
            .attr('x2', dot.x)
            .attr('y2', dot.y)
            .style('opacity', 0);
          if(dot.target){
            dot.target.targeted.splice(dot.target.targeted.indexOf(dot), 1);
            if(!dot.target.lined && dot.target.targeted.length==0){
              dot.target.opacity=this.offOpacity;
              dot.target.star.transition(this.blinkIn())
                .style('opacity', this.offOpacity)
                .style('r', 1);
            }
          }
        }
      }
    }
  }

  this.blinkage = function(){
    if(!mrchan.config.lowspec){
      var target = this.dots[Math.floor(Math.random()*this.dots.length)];
      if(target.opacity===this.offOpacity){
        target.opacity=this.medOpacity;
        target.star.transition(this.slowBlink())
          .style('opacity', this.medOpacity)
          .style('r', 2);
        setTimeout(function(){
          if(target.opacity!==this.offOpacity && !target.lined && target.targeted.length===0){
            target.opacity = this.offOpacity;
            target.star.transition(this.slowBlink())
              .style('opacity', this.offOpacity)
              .style('r', 1);
          }
        }.bind(this), 2000);
      }
    }
    setTimeout(this.blinkage.bind(this), Math.floor(Math.random()*500)+500);
  }

  this.clearage = function(){
    this.movement(null, null, null, true);
  }
}

mrchan.viewStore.DotView = DotView;