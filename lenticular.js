!function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition()
	else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
	else this[name] = definition();
}('Lenticular', function(Lenticular) {

    // Helper method, Fill in a given object with default properties.
     var extend = function(obj) {
       Array.prototype.slice.call(arguments, 1).forEach(function(source) {
         if (source) {
           for (var prop in source) {
             obj[prop] = source[prop];
           }
         }
       });
       return obj;
     },
	 
	 	after = function(x, fn) { var i = 0; return function() { i++; if(i==x) fn(); }; };
	
	function Lenticular(img1, img2, opts, fn) {
		
		// Lets feed in all our settings
		extend(this, {
			
			width: 5,
			
			height: 7, //6+(7/16),
			
			strips: 10,
			
			dpi: 300,
			
		}, opts);
		
		console.log(this);
		
		// Calculate the width each strip by the number of strips and the DPI.
		var stripWidth = this.width * this.dpi / this.strips;
	
		/**
		*
		* Helper Method. Grab a selection from a image at the particular DPI and return the canvas
		*
		* x,y,w,h are the x,y width and height of the section on the given image that will be copied.
		* The scaled_width and scaled height is the selection at the right DPI.
		*
		**/
		var getSelection = function(img, scaled_width, scaled_height, selection, fn) {
			if(!fn && typeof selection == "function") { fn = selection; selection = {x:0,y:0,w:img.width,h:img.height}}
			if(!fn) fn = function() {};
		
			var strip_canvas 	= document.createElement("canvas"),
				strip_ctx 		= strip_canvas.getContext("2d");
		
			strip_canvas.width = scaled_width;
			strip_canvas.height = scaled_height;
		
			strip_ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, strip_canvas.width, strip_canvas.height);
	
			fn(strip_canvas);

		}
		
		/**
		*
		* Lets create a canvas for the lenticular at the appropiate size.
		*
		**/
		var canvas 	= document.createElement("canvas"),
			ctx 	= canvas.getContext("2d");
			
		canvas.width = this.dpi * this.width * 2;
		canvas.height= this.dpi * this.height;
		
		/**
		*
		* Lets convert these images to the right DPI and section.
		*
		**/
		console.log("adasd");
		getSelection(	 img1, 	this.dpi * this.width, this.dpi * this.height, function(section1) {
			getSelection(img2, 	this.dpi * this.width, this.dpi * this.height, function(section2) {
				
				/**
				*
				* Lets slice the images and paste them onto the canvas
				*
				**/
				for(var i = 0; i < this.strips; i++) {
			
					var s1 = section1.getContext("2d").getImageData(i*stripWidth,0,stripWidth,section1.height),
						s2 = section2.getContext("2d").getImageData(i*stripWidth,0,stripWidth,section2.height);
		
					ctx.putImageData(s1, (i*stripWidth*2), 0);
					ctx.putImageData(s2, stripWidth + (i*stripWidth*2), 0);
				
				}
		
				// Lets convert the canvas into an image and return it
				var img = new Image();
				img.onload = function() { fn(img); };
				img.src = canvas.toDataURL("image/png");
				
			}.bind(this));
		}.bind(this));
	
	}
	
	return Lenticular;
	
});