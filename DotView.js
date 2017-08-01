function DotView() {

  this.init = function(){
    var body = this.body = mrchan.storage.d3body;
    this.dots = mrchan.storage.dots = [];
    this.density = .03;
    var porps = this.porps = body.node().getBoundingClientRect();
    this.plane = body.append('svg')
      .attr('width', porps.width)
      .attr('height', porps.height)
      .attr('id', 'plane');
    this.fadeIn = d3.transition()
      .duration(1000)
      .ease(d3.easeLinear);
    this.blinkIn = d3.transition()
      .duration(250)
      .ease(d3.easeLinear);
  }

  this.create_dots = function(){
    var plane = this.plane;
    var porps = this.porps;
    var starfield = this.starfield = plane.append('g');
    var hoverfield = this.hoverfield = plane.append('g');
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
        .style('opacity', .5);
      this.dots.push({
        'star': star,
        'x': x,
        'y':y,
        'opacity': .5
      });
    }
  }

  this.movement = function(el,hi,me){
    var coords = d3.mouse(me[hi]);
    for(var i = 0; i<mrchan.storage.dots.length; i++){
      var dot = mrchan.storage.dots[i];
      if(Math.pow(dot.x-coords[0],2)+Math.pow(dot.y-coords[1],2)<5000){
        if(dot.opacity===.5){
          dot.opacity=1;
          dot.star.transition(this.blinkOn)
            .style('opacity', 1)
            .style('r', 2);
        }
      }else{
        if(dot.opacity===1){
          dot.opacity=.5;
          dot.star.transition(this.blinkOn)
            .style('opacity', .5)
            .style('r', 1);
        }
      }
    }
  }
}

mrchan.viewStore.DotView = DotView;
var dots = mrchan.dots = new mrchan.viewStore.DotView;
dots.init();
dots.create_dots();