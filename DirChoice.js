function Directory() {

  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var choiceList = this.choiceList = [];
    var porps = this.porps = body.node().getBoundingClientRect();
    var listDiv = this.listDiv = this.body.append('div')
      .attr('id', 'directory-container');
    this.addChoice('Choice 1 snfs');
    this.addChoice('Choice 2 snfs');
    this.addChoice('Choice 3 snfs');
    this.addChoice('Choice 1 snfs');
    this.addChoice('Choice 2 snfs');
    this.addChoice('Choice 3 snfs');
    this.addChoice('Choice 1 snfs');
    this.addChoice('Choice 2 snfs');
    this.addChoice('Choice 3 snfs');
    this.addChoice('Choice 1 snfs');
    this.addChoice('Choice 2 snfs');
    this.addChoice('Choice 3 snfs');
    this.scale();
  }

  this.addChoice = function(text, func){
    var choiceCont = this.listDiv.append('div')
      .classed('directory-choice-container', true);
    var choiceText = choiceCont.append('div')
      .classed('directory-choice-text', true)
      .html(text);
    this.choiceList.push({choiceCont: choiceCont, choiceText: choiceText});
  }

  this.scale = function() {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var height = this.height = porps.height*.015 > 12 ? porps.height*.015 : 12;
    this.listDiv
      .style('width', porps.width*.3+'px')
      .style('height', porps.height*.7+'px');
    _.each(this.choiceList, function(item){
      item.choiceText
        .style('font-size', height+'px');
      item.choiceCont
        .style('width', porps.width*.3+'px')
        .style('height', height*2+'px');
      var left = (porps.width*.3 - item.choiceText.node().getBoundingClientRect().width)/2;
      item.choiceText
        .style('margin-left', left+'px');
    })
    var top = (this.listDiv.node().getBoundingClientRect().height - height*2*this.choiceList.length)/2;
    if(this.choiceList[0])this.choiceList[0].choiceCont.style('margin-top', top+'px');
  }

}

mrchan.viewStore.Directory = Directory;