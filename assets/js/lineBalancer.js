function lineBalancer(parent, paraelem) {

  var bal = this.bal = $('#balance-tester');
  this.parent = parent;
  this.dataObj = paraelem;
  this.data = paraelem.prop('outerHTML');

  var maxwidth = this.maxwidth = this.parent.width();

  var paracont = $('<div class="balance-parent"/>');
  paracont.append(paraelem);

  if(this.bal.length == 0){
    bal = this.bal = $('<div/>');
    bal.attr('id', 'balance-tester');
    bal.css('font-size', mrchan.storage.InfoPanel.porps.height*mrchan.storage.InfoPanel.bodyHeight+'px');
    mrchan.storage.$body.append(this.bal);
  }

  var metaData = this.metaData = [];

  var currentString = "";
  var inTag = false;
  var isBold = false;
  var length = this.data.length;

  for(var i = 0; i<length; i++){
    var char = this.data[i];
    var endword = false;
    if(inTag){
      if(char==='>') inTag = false;
      if(char==='b' && this.data[i-1]==='<') isBold = true;
      if(char==='b' && this.data[i-1]==='/') isBold = false;
    }else{
      if(char==='<'){
        inTag = true;
        if(currentString.length!=0)endword = true;
      }else{
        if(char!=' ')currentString+=char;
      }
      if(char===' '&&this.data[i-1]!=='>')endword = true
    }
    if(endword){
      metaData.push({
        'word': currentString,
        'bold': isBold
      })
      currentString = "";
    }
  }

  this.dataObj.find('[data-words]')

  var findSubset = this.findSubset = function(words) {
    var totalString = "";
    var arr = [];
    var width = 0;
    var height = 0;
    for(i in words){
      var word = words[i].word;
      if(words[i].bold) word = "<b>"+word+"</b>";
      bal.html(totalString+word)
      var newwidth = bal.width();
      height = bal.height();
      if(newwidth>maxwidth)break;
      width = newwidth;
      totalString+=word+" ";
      totalString = totalString.replace('</b> <b>', ' ');
      arr.push(words[i]);
    }
    for(i in arr){words.shift();}

    var ret = {
      'words': arr,
      'width': width,
      'height': height
    };
    return ret;
  }

  var divHandlers = this.divHandlers = [];

  var wordLength = this.metaData.length;
  var processor = _.clone(metaData);
  while(processor.length > 0){
    var oneLine = findSubset(processor);
    divHandlers.push(oneLine);
  }

  var initialConstruct = this.initialConstruct = function() {
    var continuity = 0;
    for(i in divHandlers){
      var cont = $('<div class="balance-div"/>');
      var para = paraelem.clone()
      cont.append(para);
      cont.css('width', divHandlers[i].width);
      para.css('left', -continuity);
      para.css('font-size', mrchan.storage.InfoPanel.porps.height*mrchan.storage.InfoPanel.bodyHeight+'px');
      continuity+=divHandlers[i].width;
      parent.append(cont);
      cont.css('height',para.css('height'));
    }
  }
  console.log(divHandlers)

  initialConstruct();

}

mrchan.utils.lineBalancer = lineBalancer;