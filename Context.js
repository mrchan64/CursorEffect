function ContextMenu() {
  
  this.init = function() {
    var body = this.body = mrchan.storage.d3body;
    var menu = this.menu = body.append('div')
      .attr('id', 'context-menu');
    this.height = -1;
    this.minWidth = mrchan.config.context.minWidth;
    this.maxWidth = mrchan.config.context.maxWidth;
    this.sizeCalc = body.append('div')
      .classed('width-tester', true);
    var menuList = this.menuList = [];
    this.addToMenu('Low Spec Mode', this.toggleLowSpec)
    this.addToMenu('Other Option', function(){})
    this.addToMenu('Option 3', function(){})
    this.addToMenu('Option 4', function(){})
    var width = this.setWidth
    _.each(menuList, function(item){
      item.style('width', width);
    })
    body.on('contextmenu', this.renderMenu.bind(this));
    body.on('click', this.closeMenu.bind(this));
  }

  this.scale = function() {

  }

  this.addToMenu = function(text, func) {
    var porps = this.porps = this.body.node().getBoundingClientRect();
    var width = this.width = this.width || porps.width*.1 > this.minWidth ? porps.width*.1 < this.maxWidth ? porps.width*.1: this.maxWidth : this.minWidth;
    var height = this.itemheight = this.itemheight || width/6;
    var tempwidth = this.sizeCalc.style('font-size', height*.65+'px').html(text).node().getBoundingClientRect().width+height*.6;
    this.setWidth = this.setWidth ? this.setWidth < tempwidth ? tempwidth : this.setWidth: tempwidth;
    var box = this.menu.append('div')
      .classed('context-item', true)
      .style('height', height*.9+'px')
      .style('font-size', height*.65+'px')
      .style('padding-top', height*.1+'px')
      .style('padding-left', height*.3+'px')
      .html(text);
    box.on('click', func);
    this.height+=Math.ceil(height*.9)+Math.ceil(height*.1);
    this.menuList.push(box);
  }

  this.renderMenu = function() {
    d3.event.preventDefault();
    this.closeMenu();
    this.menu.style('opacity', 1)
      .style('left', d3.event.pageX+'px')
      .style('top', d3.event.pageY+'px')
      .style('border-radius', this.width/20+'px')
      .style('border-top-left-radius', 0);
    this.menu.transition()
      .duration(250)
      .ease(d3.easeSin)
      .style('width', this.setWidth+'px')
      .style('height', this.height+'px');
  }

  this.closeMenu = function() {
    this.menu.style('opacity', 0)
      .style('height', '0px')
      .style('width', '0px');
  }

  this.toggleLowSpec = function(){
    mrchan.config.lowspec = !mrchan.config.lowspec
  }

}

mrchan.viewStore.ContextMenu = ContextMenu;