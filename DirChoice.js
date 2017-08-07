function Directory() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var choiceList = this.choiceList = [];
    var porps = this.porps = body.node().getBoundingClientRect();
    var listDiv = this.listDiv = this.body.append('div')
      .attr('id', 'directory-container');
    this.minHeight = mrchan.config.directory.minHeight;
    this.heightPorp = mrchan.config.directory.heightPorp;
    this.boxWidth = mrchan.config.directory.boxWidth;
    this.boxHeight = mrchan.config.directory.boxHeight;
    this.choiceMargin = mrchan.config.directory.choiceMargin;
    this.startOffset = mrchan.config.directory.startOffset;
    this.linePos = mrchan.config.directory.linePos;
    this.buffer = listDiv.append('div');
    this.addChoice('About Me');
    this.addChoice('Resume');
    this.addChoice('Languages');
    this.addChoice('Projects');
    this.addChoice('Interests');
    this.scale();
    this.renderChoices();
  }

  this.renderChoices = function() {
    var counter = 1500;
    var height = this.height;
    var lineOn = this.lineOn;
    var lineOff = this.lineOff;
    var lightOn = this.lightOn;
    var lightOff = this.lightOff;
    var startOffset = this.startOffset
    var that = this;
    _.each(this.choiceList, function(item){
      item.choiceText
        .style('opacity', 0)
        .style('margin-top', height*startOffset+'px')
        .on('mouseover', lineOn.bind(item))
        .on('mouseout', lineOff.bind(item));
      setTimeout(function(){
        item.choiceText.transition()
          .duration(500)
          .ease(d3.easeSin)
          .style('opacity', 1)
          .style('margin-top', '0px');
      }, counter);
      counter += 250;
    })
  }

  this.addChoice = function(text, func){
    var choiceCont = this.listDiv.append('div')
      .classed('directory-choice-container', true)
      .classed('not-chosen', true);
    var choiceText = choiceCont.append('div')
      .classed('directory-choice-text', true)
      .classed('basic-label', true)
      .classed('linkable', true)
      .html(text);
    var space = choiceText.append('svg')
      .classed('directory-selector', true);
    space.append('line')
      .classed('directory-selector-line', true);
    this.choiceList.push({choiceCont: choiceCont, choiceText: choiceText, choiceSpace: space, listDiv: this.listDiv});
    choiceText.on('contextmenu', function(){d3.event.preventDefault(); d3.event.stopPropagation()});
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var height = this.height = porps.height*this.heightPorp > this.minHeight ? porps.height*this.heightPorp : this.minHeight;
    this.listDiv
      .style('width', porps.width*this.boxWidth+'px')
      .style('height', porps.height*this.boxHeight+'px');
    var boxWidth = this.boxWidth;
    var choiceMargin = this.choiceMargin;
    var linePos = this.linePos;
    _.each(this.choiceList, function(item){
      item.choiceText
        .style('font-size', height+'px');
      item.choiceCont
        .style('width', porps.width*boxWidth+'px')
        .style('height', height*choiceMargin+'px');
      var width = item.choiceText.node().getBoundingClientRect().width;
      var left = (porps.width*boxWidth - width)/2;
      item.choiceText
        .style('margin-left', left+'px');
      item.choiceSpace
        .style('width', width+'px')
        .style('height', height*linePos+'px');
      item.choiceSpace.select(".directory-selector-line")
        .attr('y1', height*linePos-2)
        .attr('y2', height*linePos-2)
        .attr('x1', width/2)
        .attr('x2', width/2);
    })
    var top = (this.listDiv.node().getBoundingClientRect().height - height*2*this.choiceList.length)/2.5;
    this.buffer
      .style('height', top+'px')
      .style('width', porps.width*.3+'px');
  }

  this.lineOn = function() {
    this.choiceCont.classed('not-chosen', false);
    this.choiceSpace.select(".directory-selector-line")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .attr('x1', 0)
      .attr('x2', this.choiceText.node().getBoundingClientRect().width);
    this.listDiv.selectAll(".not-chosen")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .style('opacity', .7);
  }

  this.lineOff = function() {
    this.choiceCont.classed('not-chosen', true);
    var pos = this.choiceText.node().getBoundingClientRect().width/2
    this.choiceSpace.select(".directory-selector-line")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .attr('x1', pos)
      .attr('x2', pos);
    this.listDiv.selectAll(".not-chosen")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .style('opacity', 1);
  }

}

mrchan.viewStore.Directory = Directory;