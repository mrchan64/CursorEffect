function Mobile() {
  
  this.init = function() {
    var cookie = document.cookie;
    var start;
    if(-1 !== (start = cookie.indexOf('lowspec'))){
      var lowspec = cookie.substring(start+('lowspec').length+1,start+('lowspec').length+2);
      mrchan.config.lowspec = lowspec==='y';
    }
    this.scale();
  }

  this.scale = function() {
    var porps = mrchan.storage.d3body.node().getBoundingClientRect();
    if(!mrchan.config.mobile)this.lowspec = mrchan.config.lowspec;
    var mobile = mrchan.config.mobile = porps.width < 500 || porps.height < 600;
    mrchan.config.lowspec = mobile ? true : this.lowspec;
  }

}

mrchan.viewStore.Mobile = Mobile;