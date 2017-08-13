function InfoPanel() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var porps = this.porps = body.node().getBoundingClientRect();
    var viewport = this.viewport = this.body.append('div')
      .attr('id', 'info-container');
    this.titleHeight = mrchan.config.inform.titleHeight;
    this.bodyHeight = mrchan.config.inform.bodyHeight;
    this.boxWidth = (1-mrchan.config.directory.boxWidth)*.8;
    this.displace = [];
    this.addInfo('about');
    this.addInfo('resume');
    this.addInfo('lang');
    this.addInfo('project');
    this.addInfo('interest');
    this.scale();
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var dims = mrchan.storage.NamePlate.namePlate.node().getBoundingClientRect();
    var minLeft = (this.porps.width-dims.width)/2*.3+dims.width;
    this.viewport
      .style('width', porps.width*(1-this.boxWidth) < minLeft ? porps.width-minLeft+'px' : porps.width*this.boxWidth+'px')
      .style('height', porps.height*.7+'px')
      .style('top', porps.height*.15+'px');
    this.viewport.selectAll(".info-container-item")
      .style('width', porps.width*(1-this.boxWidth) < minLeft ? porps.width-minLeft+'px' : porps.width*this.boxWidth+'px')
      .style('height', porps.height*.7*.94+'px')
      .style('margin-top', porps.height*.7*.03+'px')
      .style('margin-bottom', porps.height*.7*.03+'px');
    this.viewport.selectAll(".buffer")
      .style('width', porps.width*(1-this.boxWidth) < minLeft ? porps.width-minLeft+'px' : porps.width*this.boxWidth+'px')
      .style('height', porps.height*.7*.5+'px');
    this.dispHeight = porps.height*.7*1.5;
  }

  this.addInfo = function(filename) {
    if(this.displace.length !== 0){
      this.viewport.append('div')
        .classed('buffer', true)
        .style('position', 'relative')
        .style('float', 'right');
    }
    var cont = this.viewport.append('div')
      .classed('info-container-item', true);
    if(filename){
      var grouping = $('<div></div>');
      var scale = this.scaleElems.bind(this);
      grouping.load('assets/htm/'+filename+'.htm', function(){
        grouping = d3.select(grouping.get(0));
        var text = grouping.select('.info-container-child').node();
        cont.node().appendChild(text);
        scale();
      })
    }
    this.displace.push(filename);
    return {container: cont}
  }

  this.scaleElems = function() {
    this.viewport.selectAll("h1")
      .style('font-size', this.porps.height*this.titleHeight+'px');
    this.viewport.selectAll("p")
      .style('background-color', '#222222')
      .style('font-size', this.porps.height*this.bodyHeight+'px');
  }

  this.reveal = function(id) {
    this.viewport
      .style('top', this.porps.height*.15+20+'px')
      .node().scrollTop = this.displace.indexOf(id) * this.dispHeight;
    this.viewport.transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('opacity', 1)
      .style('top', this.porps.height*.15+'px');
  }

  this.hide = function() {
    this.viewport.transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('opacity', 0);
  }

  this.changeTo = function(id) {
    var start = this.viewport.node().scrollTop;
    var end = this.displace.indexOf(id) * this.dispHeight;
    var i = d3.interpolateNumber(start, end);
    console.log(start, end)
    var viewport = this.viewport;
    var tw = function(t){viewport.node().scrollTop = i(t)};
    this.viewport.transition()
      .duration(500)
      .tween('scrollingtween', function(){return tw});
  }

}

mrchan.viewStore.InfoPanel = InfoPanel;