d3.namespace = "http://www.w3.org/2000/svg";

mrchan = {};
mrchan.storage = {'$body': $('body'), 'd3body': d3.select('body')};
mrchan.viewStore = {};

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