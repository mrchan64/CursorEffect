function WallpaperRotator() {

	this.links = [
		'http://i.imgur.com/wVpIicX.jpg',
		'https://i.redd.it/9d9w6pkirihz.jpg',
		'http://i.imgur.com/jgh1fin.jpg'
	];
	
	this.init = function() {
		var body = this.body = mrchan.storage.d3body;
		this.minDelay = mrchan.config.rotate.minDelay;
		this.maxDelay = mrchan.config.rotate.maxDelay;
		var background = this.background = body.append('div')
			.attr('id', 'rotator-container');
		this.loadLinks();
		this.changeToRandom();
		if(!mrchan.config.lowspec)background.style('opacity', 0);
	}

	this.scale = function() {}

	this.loadLinks = function() {
		var background = this.background;
		var imgs = this.imgs = [];
		_.each(this.links, function(link){
			var loaded = background.append('div')
				.style('left', '100%');
			loaded.append('img')
				.attr('src', link);
			imgs.push(loaded);
		});
		var index = Math.floor(Math.random()*imgs.length);
		imgs[index].style('left', '0%');
		this.active = index;
	}

	this.changeToRandom = function() {
		var delay = this.minDelay + Math.floor(Math.random()*(this.maxDelay-this.minDelay));
		var imgs = this.imgs;
		var active = this.active;
		var that = this;
		setTimeout(function(){
			var index = active;
			while(index===active){
				index = Math.floor(Math.random()*imgs.length);
			}
			imgs[index]
      	.style('left', '100%')
      	.transition("wp")
				.duration(1000)
      	.ease(d3.easeCubicInOut)
      	.style('left', '0%');
      imgs[active]
      .transition("wp")
				.duration(1000)
      	.ease(d3.easeCubicInOut)
      	.style('left', '-100%');
			that.active = index;
			that.changeToRandom();
		}, delay);
	}

}

mrchan.viewStore.WallpaperRotator = WallpaperRotator;