function InfoLabel() {
  
  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var porps = this.porps = body.node().getBoundingClientRect();
    var labeler = this.labeler = this.body.append('div')
      .attr('id', 'info-label');
    this.boxWidth = (1-mrchan.config.directory.boxWidth)*.8;
    this.addInfo('about');
    // this.addInfo('resume');
    // this.addInfo('lang');
    // this.addInfo('project');
    // this.addInfo('interest');
    this.scale();
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var dims = mrchan.storage.NamePlate.namePlate.node().getBoundingClientRect();
    var minLeft = (this.porps.width-dims.width)/2*.3+dims.width;
    this.labeler
      .style('width', porps.width*(1-this.boxWidth) < minLeft ? porps.width-minLeft+'px' : porps.width*this.boxWidth+'px');
    var height = porps.height*mrchan.config.label.heightRatio*mrchan.config.label.widthToHeight < porps.width*mrchan.config.label.maxWidth ? porps.height*mrchan.config.label.heightRatio+'px' : 'auto';
    var width = height!=='auto' ? 'auto' : porps.width*mrchan.config.label.maxWidth+'px';
    this.labeler.selectAll('.info-label-img')
      .style('height', height)
      .style('width', width);
  }

  this.addInfo = function(filename) {
    this.labeler.append('img')
      .classed('info-label-img', true)
      .attr('id', filename+'-splatter-img')
      .attr('src', '/assets/img/'+filename+'-splatter.png');
  }

  this.reveal = function(id) {
    this.labeler
      .style('display', 'block')
    this.labeler.find('#'+id+'-splatter-img')
  }

  this.hide = function() {
    this.viewport.transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('opacity', 0)
      .style('display', 'none');
  }

  this.changeTo = function(id) {
    var start = this.viewport.node().scrollTop;
    var end = this.displace.indexOf(id) * this.dispHeight;
    var i = d3.interpolateNumber(start, end);
    var viewport = this.viewport;
    var tw = function(t){viewport.node().scrollTop = i(t)};
    this.viewport.transition()
      .duration(500)
      .tween('scrollingtween', function(){return tw});
  }

}

mrchan.viewStore.InfoLabel = InfoLabel;