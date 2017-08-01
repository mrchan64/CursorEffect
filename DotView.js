function DotView() {

  this.init = function(){
    var body = this.body = mrchan.storage.d3body;
    this.dots = mrchan.storage.dots = [];
    this.lines = mrchan.storage.lines = [];
    this.density = .03;
    var porps = this.porps = body.node().getBoundingClientRect();
    this.plane = body.append('svg')
      .attr('width', porps.width)
      .attr('height', porps.height)
      .attr('id', 'plane');
    this.fadeIn = d3.transition()
      .duration(1000)
      .ease(d3.easeLinear);
    this.blinkIn = function() {
      return d3.transition()
        .duration(250)
        .ease(d3.easeLinear);
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
    for(var i = 0; i<dotsHoriz*dotsVert; i++){
      var x = Math.random()*porps.width;
      var y = Math.random()*porps.height;
      var star = starfield.append('circle')
        .attr('id', 'star'+i)
        .attr('cx', x)
        .attr('cy', y)
        .classed('star', true);
      star.transition(this.fadeIn)
        .style('opacity', .3);
      this.dots.push({
        'star': star,
        'x': x,
        'y':y,
        'opacity': .3
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
      if(coord.star) dot.target = coord.star;
      this.lines.push(dot.line);
    }
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

  this.movement = function(el,hi,me){
    var coords = d3.mouse(me[hi]);
    for(var i = 0; i<mrchan.storage.dots.length; i++){
      var dot = mrchan.storage.dots[i];
      if(Math.pow(dot.x-coords[0],2)+Math.pow(dot.y-coords[1],2)<5000){
        if(dot.opacity===.3){
          dot.opacity=1;
          dot.star.transition(this.blinkIn())
            .style('opacity', 1)
            .style('r', 2);
          dot.line.transition(this.blinkIn())
            .attr('x2', dot.x2)
            .attr('y2', dot.y2)
            .style('opacity', .5);
        }
      }else{
        if(dot.opacity===1){
          dot.opacity=.3;
          dot.star.transition(this.blinkIn())
            .style('opacity', .3)
            .style('r', 1);
          dot.line.transition(this.blinkIn())
            .attr('x2', dot.x)
            .attr('y2', dot.y)
            .style('opacity', 0);
        }
      }
    }
  }
}

mrchan.viewStore.DotView = DotView;
var dots = mrchan.dots = new mrchan.viewStore.DotView;
dots.init();
dots.create_dots();