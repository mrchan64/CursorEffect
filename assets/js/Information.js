function InfoPanel() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var porps = this.porps = body.node().getBoundingClientRect();
    var viewport = this.viewport = this.body.append('div')
      .attr('id', 'info-container');
    this.titleHeight = mrchan.config.inform.titleHeight;
    this.bodyHeight = mrchan.config.inform.bodyHeight;
    this.boxWidth = (1-mrchan.config.directory.boxWidth)*.8;
    this.topRatio = mrchan.config.inform.topRatio;
    this.displace = [];
    this.linebalancers = [];
    this.loading = 0;
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
    this.scaleElems();
  }

  this.addInfo = function(filename) {
    this.loading++;
    if(this.displace.length !== 0){
      this.viewport.append('div')
        .classed('buffer', true)
        .style('position', 'relative')
        .style('float', 'right');
    }
    var cont = this.viewport.append('div')
      .classed('info-container-item', true);
    if(filename){
      var grouping = $('<div/>');
      var scale = this.scaleElems.bind(this);
      var linebalancers = this.linebalancers;
      var viewport = this.viewport;
      var that = this;
      grouping.load('assets/htm/'+filename+'.htm', function(){
        viewport.style('display', 'block');
        var text = grouping.find('.info-container-child');
        var textbody = $('<div class="info-container-child"/>');
        textbody.attr('id', filename+'-info');
        cont.node().appendChild(textbody.get(0));
        var first = true;
        text.children().each(function(index){
          if(!first)textbody.append($('<div class="info-container-buffer">'));
          first = false;
          linebalancers.push(new mrchan.utils.lineBalancer(textbody, $(this)));
        })
        that.loading--;
        that.scaleElems();
        viewport.style('display', 'none');
      });
    }
    this.displace.push(filename);
    return {container: cont}
  }

  this.scaleElems = function() {
    if(this.loading!=0)return;
    var disp = this.viewport.style('display');
    this.viewport.style('display', 'block');
    _.each(this.linebalancers, function(balancer){
      balancer.scale();
    })
    var topRatio = this.topRatio;
    this.viewport.selectAll(".info-container-item").each(function(d, i){
      var height = 0;
      that = d3.select(this);
      var maxheight = this.getBoundingClientRect().height;
      _.each(that.select(".info-container-child").node().childNodes, function(div){
        var div = $(div);
        if(div.hasClass('info-container-buffer'))height += maxheight*.03;
        else height += parseInt(div.children().first().css('font-size').replace('px',''))*1.5;
      });
      var top = (maxheight - height)*topRatio;
      that.select(".info-container-child")
        .style('height', height+'px')
        .style('top', top+'px');
    });
    mrchan.storage.InfoLabel.scaleLabels();
    this.viewport.style('display', disp);
  }

  this.reveal = function(id) {
    mrchan.storage.InfoLabel.reveal(id);
    this.viewport
      .style('top', this.porps.height*.15+20+'px')
      .style('display', 'block')
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
      .style('opacity', 0)
    mrchan.storage.InfoLabel.hide();
    var viewport = this.viewport;
    setTimeout(function(){viewport.style('display', 'none');},200);
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
    mrchan.storage.InfoLabel.changeTo(id);
  }

}

mrchan.viewStore.InfoPanel = InfoPanel;