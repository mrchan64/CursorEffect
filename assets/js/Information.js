function InfoPanel() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var porps = this.porps = body.node().getBoundingClientRect();
    var viewport = this.viewport = this.body.append('container')
      .attr('id', 'info-container');
    this.titleHeight = mrchan.config.inform.titleHeight;
    this.bodyHeight = mrchan.config.inform.bodyHeight;
    this.boxWidth = (1-mrchan.config.directory.boxWidth)*.8;
    this.infoList = [];
    this.addInfo('about');
    this.addInfo();
    this.addInfo();
    this.addInfo();
    this.addInfo();
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
    this.viewport.selectAll("h1")
      .style('font-size', this.porps.height*this.titleHeight+'px');
    this.viewport.selectAll("p")
      .style('font-size', this.porps.height*this.bodyHeight+'px');
    console.log(this.porps.height*this.titleHeight)
  }

  this.addInfo = function(filename) {
    if(this.infoList.length !== 0){
      this.viewport.append('div')
        .classed('buffer', true)
        .style('position', 'relative')
        .style('float', 'right');
    }
    var cont = this.viewport.append('div')
      .classed('info-container-item', true);
    if(filename){
      var grouping = $('<div></div>');
      grouping.load('assets/htm/'+filename+'.htm', function(){
        grouping = d3.select(grouping.get(0));
        var text = grouping.select('.info-container-child').node();
        cont.node().appendChild(text);
      })
    }
    return {container: cont}
  }

}

mrchan.viewStore.InfoPanel = InfoPanel;