function ContextMenu() {
  
  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var menu = this.menu = body.append('div')
      .attr('id', 'context-menu');
    this.height = 0;
    this.minWidth = mrchan.config.context.minWidth;
    this.maxWidth = mrchan.config.context.maxWidth;
    var menuList = this.menuList = [];
    this.addToMenu('Low Spec Mode', function(){})
    body.on('contextmenu', this.renderMenu.bind(this))
  }

  this.addToMenu = function(text, func) {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var width = this.width = this.width || porps.width*.1 > this.minWidth ? porps.width*.1 < this.maxWidth ? porps.width*.1: this.maxWidth : this.minWidth;
    var height = this.itemheight = this.itemheight || width/6;
    console.log(width, height)
    var box = this.menu.append('div')
      .classed('context-item', true)
      .style('width', width+'px')
      .style('height', height+'px')
      .style('font-height', height*.8+'px')
      .style('padding-top', height*.1+'px')
      .html(text);
    box.on('click', func);
    this.height+=height;
    this.menuList.push(box);
  }

  this.renderMenu = function(event, d) {
    d3.event.preventDefault();
    this.menu.style('opacity', 1)
      .style('left', d3.event.pageX+'px')
      .style('top', d3.event.pageY+'px');
    this.menu.transition()
      .duration(250)
      .ease(d3.easeSin)
      .style('width', this.width+'px')
      .style('height', this.height+'px');
  }

}

mrchan.viewStore.ContextMenu = ContextMenu;
var contextMenu = mrchan.contextMenu = new mrchan.viewStore.ContextMenu();
contextMenu.init();