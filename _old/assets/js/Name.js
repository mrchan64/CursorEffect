function NamePlate() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var minWidth = this.minWidth = mrchan.config.namePlate.minWidth;
    var maxWidth = this.maxWidth = mrchan.config.namePlate.maxWidth;
    var minHeight = this.minHeight = mrchan.config.namePlate.minHeight;
    var namePlate = this.namePlate = body.append('div')
      .attr('id', 'name-capsule');
    var slideBox = this.slideBox = namePlate.append('div')
      .attr('id', 'name-slide-box')
      .classed('basic-label', true);
      //.on(hover)
    slideBox.html('Matthew Chan');
    this.scale();
    var startMarg = namePlate.node().getBoundingClientRect().height-slideBox.node().getBoundingClientRect().height;
    slideBox.style('top', startMarg+'px');
    setTimeout(this.transition.bind(this), 1000);
  }

  this.transition = function() {
    this.slideBox.transition()
      .duration(1500)
      .ease(d3.easeSin)
      .style('opacity', 1)
      .style('top', '0px');
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var width = porps.width*.3 > this.minWidth ? porps.width*.3 < this.maxWidth ? porps.width*.3: this.maxWidth : this.minWidth;
    var height = width/5;
    var dims = this.namePlate.node().getBoundingClientRect();
    var left = mrchan.config.directory.isLeft ? (porps.width-dims.width)/2*.3 : (porps.width-width)/2;
    this.namePlate
      .style('width', width+'px')
      .style('height', height+'px')
      .style('margin-top', height+'px')
      .style('margin-left', left+'px');
    this.slideBox
      .style('width', width+'px')
      .style('height', height*.925+'px')
      .style('font-size', height*.8*.8+'px');
    if(this.outlineCont)this.outlineCont.remove();
    this.drawOutline();
  }

  this.drawOutline = function() {
    var porps = this.slideBox.node().getBoundingClientRect();
    var height = this.contHeight = porps.height*.9;
    var width = this.contWidth = porps.width;
    var container = this.outlineCont = this.slideBox.append('svg')
      .classed('linkable', true)
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .attr('width', width+'px')
      .attr('height', height+'px');
    var path = 'M0 0 v '+height+' h '+width+' v '+(-height)+' Z';
    var outline = this.outline = container.append('path')
      .attr('id', 'name-outline')
      .attr('d', path);
    var len = height*2+width*2+1;
    outline
      .attr('stroke-dasharray', len)
      .attr('stroke-dashoffset', len);
    container.on('mouseover', this.animateOutline.bind(this));
    container.on('mouseout', this.deanimateOutline.bind(this));
    container.on('contextmenu', function(){d3.event.preventDefault(); d3.event.stopPropagation()});
    container.on('click', this.shiftMiddle.bind(this));
  }

  this.animateOutline = function(el,hi,me) {
    mrchan.storage.DotView.clearage();
    this.calculateLine(d3.mouse(me[hi]));
    this.outline.transition()
      .duration(300)
      .ease(d3.easeSin)
      .attr('stroke-dashoffset', 0);
  }

  this.deanimateOutline = function() {
    var porps = this.slideBox.node().getBoundingClientRect();
    var len = porps.height*.9*2+porps.width*2+1;
    this.outline.transition()
      .duration(300)
      .ease(d3.easeSin)
      .attr('stroke-dashoffset', len);
  }

  this.calculateLine = function(coords) {

  }

  this.shiftLeft = function() {
    // called from dirchoice shiftleft
    var dims = this.namePlate.node().getBoundingClientRect();
    this.namePlate.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('margin-left', (this.porps.width-dims.width)/2*.3+'px');
  }

  this.shiftMiddle = function() {
    //called from the listener on outline cont so you need the check here
    if(!mrchan.config.directory.isLeft)return;
    mrchan.config.directory.isLeft = false;
    var dims = this.namePlate.node().getBoundingClientRect();
    mrchan.storage.NamePlate.namePlate.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('margin-left', (this.porps.width-dims.width)/2+'px');
    mrchan.storage.Directory.shiftMiddle();
  }

}

mrchan.viewStore.NamePlate = NamePlate;