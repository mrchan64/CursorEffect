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
    this.sepLine = listDiv.append('svg').attr('id', 'directory-separator');
    this.sepLine.append('line').attr('id', 'directory-separator-line');
    this.buffer = listDiv.append('div');
    this.addChoice('About Me', 'about');
    this.addChoice('Resume', 'resume');
    this.addChoice('Languages', 'lang');
    this.addChoice('Projects', 'project');
    this.addChoice('Interests', 'interest');
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
    var startOffset = this.startOffset;
    var shiftLeft = this.shiftLeft;
    var shiftMiddle = this.shiftMiddle;
    var that = this;
    _.each(this.choiceList, function(item){
      item.choiceText
        .style('opacity', 0)
        .style('margin-top', height*startOffset+'px')
        .on('mouseover', lineOn.bind(item))
        .on('mouseout', lineOff.bind(item))
        .on('click', shiftLeft.bind(item));
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

  this.addChoice = function(text, id){
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
    this.choiceList.push({choiceCont: choiceCont, choiceText: choiceText, choiceSpace: space, listDiv: this.listDiv, id: id});
    choiceText.on('contextmenu', function(){d3.event.preventDefault(); d3.event.stopPropagation()});
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var height = this.height = porps.height*this.heightPorp > this.minHeight ? porps.height*this.heightPorp : this.minHeight;
    var left = mrchan.config.directory.isLeft ? 0 : porps.width*(1-this.boxWidth)/2;
    this.listDiv
      .style('width', porps.width*this.boxWidth+'px')
      .style('height', porps.height*this.boxHeight+'px')
      .style('margin-left', left+'px');
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
    var dims = this.listDiv.node().getBoundingClientRect();
    var top = (dims.height - height*2*this.choiceList.length)/2.5;
    this.buffer
      .style('height', top+'px')
      .style('width', porps.width*.3+'px');
    this.sepLine
      .style('top', mrchan.config.directory.isLeft ? '0px' : dims.height/2+'px')
      .style('height', mrchan.config.directory.isLeft ? dims.height : '0px');
    this.sepLine.select("#directory-separator-line")
      .attr('x1', 3)
      .attr('x2', 3)
      .attr('y1', 0)
      .attr('y2', dims.height);
  }

  this.lineOn = function() {
    mrchan.storage.DotView.clearage();
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
    this.listDiv.selectAll(".not-chosen")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .style('opacity', 1);
    if(this.choiceCont.classed('active'))return;
    this.choiceCont.classed('not-chosen', true);
    var pos = this.choiceText.node().getBoundingClientRect().width/2;
    this.choiceSpace.select(".directory-selector-line")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .attr('x1', pos)
      .attr('x2', pos);
  }

  this.shiftLeft = function() {
    //called from item event listener
    //bound to item object being shifted
    //put in code here to create info
    var pos = this.choiceText.node().getBoundingClientRect().width/2;
    if(this.choiceCont.classed('active')){
      this.choiceCont
        .select(".directory-selector-line")
        .attr('x1', pos)
        .attr('x2', pos)
        .transition()
        .duration(100)
        .ease(d3.easeSin)
        .attr('x1', 0)
        .attr('x2', pos*2);
      return;
    }
    this.listDiv.select(".active")
      .classed('not-chosen', true)
      .classed('active', false)
      .style('opacity', .7)
      .select(".directory-selector-line")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .attr('x1', pos)
      .attr('x2', pos);
    this.choiceCont
      .classed('not-chosen', false)
      .classed('active', true);
    if(mrchan.config.directory.isLeft){
      mrchan.storage.InfoPanel.changeTo(this.id);
      return;
    };
    mrchan.config.directory.isLeft = true;
    this.listDiv.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('margin-left', '0px');
    mrchan.storage.NamePlate.shiftLeft();
    var dims2 = this.listDiv.node().getBoundingClientRect();
    var listDiv = this.listDiv;
    var id = this.id;
    setTimeout(function(){
      listDiv.select("#directory-separator").transition()
        .duration(200)
        .ease(d3.easeCubicInOut)
        .style('top', '0px')
        .style('height', dims2.height+'px');
      mrchan.storage.InfoPanel.reveal(id);
    }, 300)
  }

  this.shiftMiddle = function() {
    //called from name shift middle
    var pos = this.listDiv.select(".directory-choice-container.active").node().getBoundingClientRect().width/2;
    this.listDiv.select(".active")
      .classed('not-chosen', true)
      .classed('active', false)
      .select(".directory-selector-line")
      .transition()
      .duration(100)
      .ease(d3.easeSin)
      .attr('x1', pos)
      .attr('x2', pos);
    this.listDiv.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('margin-left', this.porps.width*(1-this.boxWidth)/2+'px');
    var dims2 = this.listDiv.node().getBoundingClientRect();
    this.listDiv.select("#directory-separator").transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .style('top', dims2.height/2+'px')
      .style('height', '0px');
    mrchan.storage.InfoPanel.hide();
  }

}

mrchan.viewStore.Directory = Directory;