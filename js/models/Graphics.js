(function(){

	function Graphics(source){

		if(typeof source == "string"){
			this._parent(nsn.Engine.assets[source]);
		}else{
			this._parent(source);
		}

	}

	var proto = nsn.extend(Graphics, createjs.Bitmap);

	nsn.addEventHelpers(proto);

	proto.width = function(){
		return this.image.width;
	}

	proto.height = function(){
		return this.image.height;
	}

	proto.setPosition = function(x, y){
		this.image.x = x;
		this.image.y = y;
	}

	nsn.Graphics = Graphics;

})();