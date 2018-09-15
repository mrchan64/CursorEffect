d3.namespace = "http://www.w3.org/2000/svg";

mrchan = {};
mrchan.storage = {'$body': $('body'), 'd3body': d3.select('body')};
mrchan.utils = {};
mrchan.viewStore = {};
mrchan.config = {};
// mrchan.config.mobile = false;
// mrchan.config.lowspec = false;
// mrchan.config.rotate = {};
// mrchan.config.rotate.minDelay = 5000;
// mrchan.config.rotate.maxDelay = 10000;
mrchan.config.stars = {};
mrchan.config.stars.density = .03;
mrchan.config.stars.maxStars = 2000;
mrchan.config.stars.onOpacity = .7;
mrchan.config.stars.medOpacity = .5;
mrchan.config.stars.offOpacity = .2;
mrchan.config.stars.lineOpacity = .4;
// mrchan.config.namePlate = {};
// mrchan.config.namePlate.minWidth = 250;
// mrchan.config.namePlate.maxWidth = 450;
// mrchan.config.namePlate.minHeight = 50;
// mrchan.config.directory = {};
// mrchan.config.directory.minHeight = 12;
// mrchan.config.directory.heightPorp = .015;
// mrchan.config.directory.boxWidth = .3;
// mrchan.config.directory.boxHeight = .7;
// mrchan.config.directory.choiceMargin = 2.5;
// mrchan.config.directory.startOffset = 1;
// mrchan.config.directory.linePos = 1.5;

mrchan.transitions = {};
mrchan.transitions.fadeIn = d3.transition()
  .duration(1000)
  .ease(d3.easeSin);

mrchan.storage.d3body.attr('onload', 'initAll()');
$(window).resize(scaleAll);

function initAll() {
  _.each(mrchan.viewStore, function(value, key){
    if(typeof value == 'function'){
      mrchan.storage[key] = new value();
      mrchan.storage[key].init();
    }
  })
}

function scaleAll() {
  _.each(mrchan.viewStore, function(value, key){
    mrchan.storage[key].scale();
  })
}
