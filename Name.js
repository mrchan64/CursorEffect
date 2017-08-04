function NamePlate() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var minWidth = this.minWidth = mrchan.config.namePlate.minWidth;
    var maxWidth = this.maxWidth = mrchan.config.namePlate.maxWidth;
    var minHeight = this.minHeight = mrchan.config.namePlate.minHeight;
    var namePlate = this.namePlate = body.append('div')
      .attr('id', 'name-capsule');
    var slideBox = this.slideBox = namePlate.append('div')
      .attr('id', 'name-slide-box');
      //.on(hover)
    this.scale();
    var startMarg = namePlate.node().getBoundingClientRect().height-slideBox.node().getBoundingClientRect().height;
    slideBox.style('top', startMarg+'px');
    slideBox.html('Matthew Chan');
    slideBox.transition()
      .duration(1500)
      .ease(d3.easeSin)
      .style('opacity', 1)
      .style('top', '0px');

  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var width = porps.width*.3 > this.minWidth ? porps.width*.3 < this.maxWidth ? porps.width*.3: this.maxWidth : this.minWidth;
    var height = width/5;
    this.namePlate
      .style('width', width+'px')
      .style('height', height+'px')
      .style('margin-top', height+'px');
    this.slideBox
      .style('width', width+'px')
      .style('height', height*.925+'px')
      .style('font-size', height*.8*.8+'px');
  }

}

mrchan.viewStore.NamePlate = NamePlate;
var namePlate = mrchan.namePlate = new mrchan.viewStore.NamePlate();
setTimeout(namePlate.init.bind(namePlate), 1000)