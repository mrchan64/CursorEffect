function NamePlate() {

  this.init = function() {
    console.log('started')
    var body = this.body = mrchan.storage.d3body;
    var minWidth = this.minWidth = mrchan.config.namePlate.minWidth;
    var minHeight = this.minHeight = mrchan.config.namePlate.minHeight;
    var namePlate = this.namePlate = body.append('div')
      .attr('id', 'name-capsule');
    var slideBox = this.slideBox = namePlate.append('div')
      .attr('id', 'name-slide-box');
      //.on(hover)
    this.scale();
    this.fadeIn = function() {
      return d3.transition()
        .duration(1000)
        .ease(d3.easeSin);
    }
    var startMarg = namePlate.node().getBoundingClientRect().height-slideBox.node().getBoundingClientRect().height;
    slideBox.style('top', startMarg+'px');
    slideBox.html('Matthew Chan');
    slideBox.transition(this.fadeIn())
      .style('opacity', 1)
      .style('top', '0px');

  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var width = porps.width*.3 > this.minWidth ? porps.width*.3 : this.minWidth;
    var height = width/5;
    this.namePlate
      .style('width', width+'px')
      .style('height', height+'px')
      .style('margin-top', height+'px');
    this.slideBox
      .style('width', width+'px')
      .style('height', height*.8+'px')
      .style('font-size', height*.8*.8+'px');
  }

}

mrchan.viewStore.NamePlate = NamePlate;
var namePlate = mrchan.namePlate = new mrchan.viewStore.NamePlate();
setTimeout(namePlate.init.bind(namePlate), 500)