function blockBalancer(parent, blockelem) {
	blockelem.addClass('block-div');
	parent.append(blockelem);
	blockelem.on('load', function(){
		mrchan.storage.InfoPanel.scaleElems();
	})

	this.scale = function(){

	}
}

mrchan.utils.blockBalancer = blockBalancer;