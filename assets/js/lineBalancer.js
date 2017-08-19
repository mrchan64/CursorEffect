function lineBalancer(parent, paraelem) {

  var bal = this.bal = $('#balance-tester');
  this.parent = parent;
  this.dataObj = paraelem;

  var clone = paraelem.clone();
  clone.find("[data-words]").attr("data-words", function(i,d){
    var $self = $(this),
        $words = d.split("|"),
        total = $words.length,
        id = $self.attr('id');
    $self.append($('<'+id+'_1/>', {'text': $words[0]}));
    $self.append($('<'+id+'_2/>', {'text': $words[1]}));
  });
  var data = this.data = clone.prop('outerHTML');

  var maxwidth = this.maxwidth = this.parent.width();
  var fontsize = this.fontsize = mrchan.storage.InfoPanel.porps.height*mrchan.storage.InfoPanel.bodyHeight;

  var paracont = $('<div class="balance-parent"/>');
  paracont.append(paraelem);

  if(this.bal.length == 0){
    bal = this.bal = $('<div/>');
    bal.attr('id', 'balance-tester');
    bal.css('font-size', mrchan.storage.InfoPanel.porps.height*mrchan.storage.InfoPanel.bodyHeight+'px');
    mrchan.storage.$body.append(this.bal);
  }

  bal.html('&nbsp;');
  var whitespace = bal.width();

  var metaData = this.metaData = [];

  var currentString = "";
  var inTag = false;
  var isBold = false;
  var identifier = "";
  var isHidden = false;
  var length = this.data.length;

  var findIdInFakeTag = function(index){
    var str = "";
    for(var i = index-1; i>0; i--){
      if(data[i]=='<')return str;
      str = data[i]+str;
    }
  }

  for(var i = 0; i<length; i++){
    var char = this.data[i];
    var endword = false;
    if(inTag){
      if(char==='>') inTag = false;
      if(char==='b' && this.data[i-1]==='<') isBold = true;
      if(char==='b' && this.data[i-1]==='/') isBold = false;
      if(char==='_'){
        var tag = findIdInFakeTag(i);
        if(tag[0]!='/'){
          identifier = tag;
          isBold=true;
        }else{
          identifier = '';
          isHidden = false;
          isBold=false;
          continue;
        }
        if(this.data[i+1]==2) isHidden = true;
      }
    }else{
      if(char==='<'){
        inTag = true;
        if(currentString.length!=0)endword = true;
      }else{
        if(char!=' ')currentString+=char;
      }
      if(char===' ' && this.data[i-1]!=='>')endword = true
    }
    if(endword){
      metaData.push({
        'word': currentString,
        'bold': isBold,
        'identifier': identifier,
        'hidden': isHidden
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
      if(!words[i].hidden){
        var word = words[i].word;
        if(words[i].bold) word = "<b>"+word+"</b>";
        bal.html(totalString+word)
        var newwidth = bal.width();
        height = bal.height();
        if(newwidth>maxwidth)break;
        width = newwidth;
        totalString+=word+" ";
        totalString = totalString.replace('</b> <b>', ' ');
      }
      arr.push(words[i]);
    }
    bal.html(totalString);
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
  function reprocess(){
    var processor = _.clone(metaData);
    while(processor.length > 0){
      var oneLine = findSubset(processor);
      divHandlers.push(oneLine);
      //if(divHandlers.length==2)break;
    }
  }
  reprocess();

  function transition(item, direction){
    if(direction){
      item.$self.stop();
      item.$self.animate({'width': item.$words.eq(1).width()},250);
      item.$words.stop();
      item.$words.eq(0).fadeOut(250);
      item.$words.eq(1).fadeIn(250);
    }else{
      item.$self.stop();
      item.$self.animate({'width': item.$words.eq(0).width()},250);
      item.$words.stop();
      item.$words.eq(1).fadeOut(250);
      item.$words.eq(0).fadeIn(250);
    }
  }

  var madeDivs = [];
  var madeParas = [];

  var hidespans = {};

  var restructure = function(identifier){
    divHandlers = [];
    _.each(metaData, function(item){
      if(item.identifier===identifier)item.hidden=!item.hidden;
    });
    reprocess();
    var continuity = 0;
    var counter = 0;
    _.each(divHandlers, function(handler, key){
      if(!madeDivs[key]){
        var cont = $('<div class="balance-div"/>');
        var para = paraelem.clone()
        cont.append(para);
        para.css('font-size', fontsize+'px');
        parent.append(cont);
        madeDivs.push({'cont': cont,'elem':para});
        para.find("[data-words]").attr("data-words", function(i,d){
          var $self = $(this),
              $words = d.split("|"),
              total = $words.length,
              id = $self.attr('id');
          for(i in $words) $self.append($('<span/>', {'text': $words[i]}));
          $words = $self.find("span").show();
          $words.eq(1).hide();
          $self.css({'width': $words.eq(0).width(), 'height': $words.eq(0).height()});
          if(!hidespans[id])hidespans[id] = {
            'state': 'off',
            'wordsets': []
          }
          hidespans[id].wordsets.push({'$self': $self, '$words': $words});
          $self.on('mouseover', function(){
            if(hidespans[id].state==='on')return;
            hidespans[id].state = 'on';
            restructure(id);
            _.each(hidespans[id].wordsets, function(item){
              transition(item, true);
            });
          });
          $self.on('mouseout', function(){
            if(hidespans[id].state==='off')return;
            hidespans[id].state = 'off';
            restructure(id);
            _.each(hidespans[id].wordsets, function(item){
              transition(item, false);
            });
          });
        });
      }
      madeDivs[key].cont.stop();
      madeDivs[key].cont.animate({'width': handler.width}, 250);
      madeDivs[key].elem.stop();
      madeDivs[key].elem.animate({'left': -continuity}, 250);
      continuity+=handler.width+whitespace;
      counter++;
    })
    for(; counter<madeDivs.length; counter++){
      madeDivs[counter].cont.stop();
      madeDivs[counter].cont.animate({'width': 0}, 250);
      madeDivs[counter].elem.stop();
      madeDivs[counter].elem.animate({'left': -continuity}, 250);
    }
  }

  var initialConstruct = this.initialConstruct = function() {
    var continuity = 0;
    for(i in divHandlers){
      var cont = $('<div class="balance-div"/>');
      var para = paraelem.clone()
      cont.append(para);
      cont.css('width', divHandlers[i].width);
      para.css('left', -continuity);
      para.css('font-size', fontsize+'px');
      continuity+=divHandlers[i].width+whitespace;
      parent.append(cont);
      madeDivs.push({'cont': cont,'elem':para});
      cont.css('height',para.css('height'));
      para.find("[data-words]").attr("data-words", function(i,d){
        var $self = $(this),
            $words = d.split("|"),
            total = $words.length,
            id = $self.attr('id');
        for(i in $words) $self.append($('<span/>', {'text': $words[i]}));
        $words = $self.find("span").show();
        $words.eq(1).hide();
        $self.css({'width': $words.eq(0).width(), 'height': $words.eq(0).height()});
        if(!hidespans[id])hidespans[id] = {
          'state': 'off',
          'wordsets': []
        }
        hidespans[id].wordsets.push({'$self': $self, '$words': $words});
        $self.on('mouseover', function(){
          if(hidespans[id].state==='on')return;
          hidespans[id].state = 'on';
          restructure(id);
          _.each(hidespans[id].wordsets, function(item){
            transition(item, true);
          });
        });
        $self.on('mouseout', function(){
          if(hidespans[id].state==='off')return;
          hidespans[id].state = 'off';
          restructure(id);
          _.each(hidespans[id].wordsets, function(item){
              transition(item, false);
          });
        });
      });
    }
  }
  console.log(divHandlers)

  initialConstruct();

}

mrchan.utils.lineBalancer = lineBalancer;