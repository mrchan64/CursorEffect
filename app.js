d3.namespace = "http://www.w3.org/2000/svg";

mrchan = {};
mrchan.storage = {'$body': $('body'), 'd3body': d3.select('body')};
mrchan.viewStore = {};
mrchan.config = {};
mrchan.config.lowspec = false;
mrchan.config.stars = {};
mrchan.config.stars.density = .03;
mrchan.config.stars.maxStars = 2000;
mrchan.config.stars.onOpacity = .7;
mrchan.config.stars.medOpacity = .5;
mrchan.config.stars.offOpacity = .2;
mrchan.config.stars.lineOpacity = .4;
mrchan.config.namePlate = {};
mrchan.config.namePlate.minWidth = 250;
mrchan.config.namePlate.maxWidth = 450;
mrchan.config.namePlate.minHeight = 50;
mrchan.config.context = {};
mrchan.config.context.minWidth = 50;
mrchan.config.context.maxWidth = 150;

mrchan.transitions = {};
mrchan.transitions.fadeIn = d3.transition()
  .duration(1000)
  .ease(d3.easeSin);

var pickRandomDir = function(){
  return Math.floor(Math.random()*360);
}

var getColor = function(){
  var ret = 'rgb(150,'+Math.floor(Math.sin(storage.colorDeg)*255)+','+Math.floor(Math.cos(storage.colorDeg)*255)+')';
  storage.colorDeg+=0.04
  console.log(ret)
  return ret;
}

var createThing = function(){
  if(!(storage.x&&storage.y))return;
  var dot = $('<div/>')
    .addClass('dot')
    .css('top',storage.y)
    .css('left',storage.x)
    .css('background-color',getColor());
  storage.body.append(dot);
  dot.animate({'top':storage.y+200,'left':storage.x-10,'width':20,'height':20,'opacity':0}, 1000);
  setTimeout(function(){
    dot.remove();
  },1000);
}

var moveDiv = function(event){
  storage.x = event.pageX;
  storage.y = event.pageY;
}

//storage.body.mousemove(moveDiv)
//setInterval(createThing, 20);