function InfoLabel() {
  
  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var porps = this.porps = body.node().getBoundingClientRect();
    var labeler = this.labeler = this.body.append('div')
      .attr('id', 'info-label');
    this.boxWidth = (1-mrchan.config.directory.boxWidth)*.8;
    this.addInfo('about');
    this.addInfo('resume');
    this.addInfo('lang');
    this.addInfo('project');
    this.addInfo('interest');
    this.positions = {};
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

  this.scaleLabels = function() {
    var positions = this.positions;
    var viewport = mrchan.storage.InfoPanel.viewport;
    var disp = viewport.style('display');
    viewport.style('display', 'block');
    this.labeler.style('display', 'block');
    this.labeler.selectAll('.info-label-img').each(function(){
      if(!this)return;
      var img = d3.select(this);
      var id = img.attr('id').replace('-splatter-img', '');
      var info = viewport.select('#'+id+'-info');
      var lowerbound = info.node().getBoundingClientRect().top-info.node().parentNode.offsetTop+Math.round(parseFloat(info.node().parentNode.style['margin-top'].replace('px','')))+viewport.node().scrollTop;
      positions[id] = {
        unshiftedTop: lowerbound-img.node().getBoundingClientRect().height*mrchan.config.label.percentUncovered,
        shiftedTop: lowerbound-img.node().getBoundingClientRect().height
      }
      img.style('top', positions[id].unshiftedTop+'px');
    });
    viewport.style('display', disp);
    this.labeler.style('display', disp);
  }

  this.addInfo = function(filename) {
    this.labeler.append('img')
      .classed('info-label-img', true)
      .attr('id', filename+'-splatter-img')
      .attr('src', '/assets/img/'+filename+'-splatter.png');
  }

  this.shiftLabel = function(id) {
    var img = this.labeler.select('#'+id+'-splatter-img');
    img.transition("shift")
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('top', this.positions[id].shiftedTop+'px');
  }

  this.unshiftLabel = function(id) {
    var img = this.labeler.select('#'+id+'-splatter-img');
    img.transition("shift")
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('top', this.positions[id].unshiftedTop+'px');
  }

  this.reveal = function(id) {
    this.scaleLabels();
    this.labeler
      .style('display', 'block')
      .style('opacity', 1);
    this.changeTo(id, 200);
  }

  this.hide = function() {
    this.labeler
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('opacity', 0);
    var labeler = this.labeler;
    setTimeout(function(){labeler.style('display', 'none');labeler.select('.activelabel').classed('activelabel', false).style('opacity', 0);},200);
  }

  this.changeTo = function(id, timing) {
    this.labeler.select('.activelabel')
      .classed('activelabel', false)
      .transition()
      .duration(250)
      .style('opacity', 0);
    var porps = this.labeler.node().getBoundingClientRect();
    this.labeler.select('#'+id+'-splatter-img')
      .classed('activelabel', true)
      .style('left', porps.width+'px')
      .style('opacity', 1)
      .transition()
      .duration(timing || 500)
      .ease(d3.easeCubicInOut)
      .style('left', '0px');
  }

}

mrchan.viewStore.InfoLabel = InfoLabel;