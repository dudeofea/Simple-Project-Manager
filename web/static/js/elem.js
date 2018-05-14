//
//	ELEMENTS
//
//	Convenience functions to create elements
//

//add document fallback for testing
var test = false;
if(typeof document == "undefined" || document == null){
	var MockBrowser = require('mock-browser').mocks.MockBrowser;
	var mock = new MockBrowser();
	document = mock.getDocument();
	test = true;
}

Elem = function(tag, attributes, content){
	//create the element
	var e = document.createElement(tag);
	if(typeof content != "undefined"){
		e.innerHTML = content;
	}
	if(attributes){
		for (var a in attributes) {
			if (attributes.hasOwnProperty(a)) {
				e.setAttribute(a, attributes[a]);
			}
		}
	}
	//add custom functions
	e.addClass = function(name){
		if(this.className.indexOf(name) !== -1){
			return;
		}
		this.className += " " + name;
	}
	e.removeClass = function(name){
		//TODO: use regex to replace all instances of name in class
	}
	//add fallback for canvas context
	if(test && tag.toUpperCase() == "CANVAS"){
		e.getContext = function(){
			return {
				beginPath: function(){},
				moveTo: function(){},
				lineTo: function(){},
				quadraticCurveTo: function(){},
				closePath: function(){},
				fill: function(){},
				arc: function(){},
				drawImage: function(){},
				save: function(){},
				translate: function(){},
				rotate: function(){},
				restore: function(){},
				fillRect: function(){},
			}
		};
	}
	//clone node override to copy canvas contents
	e.regularCloneNode = e.cloneNode;
	e.cloneNode = function(deep){
		var cloned = this.regularCloneNode(deep);
		if(this.tagName == "CANVAS"){
			//copy old contents onto new canvas
			var ctx = cloned.getContext('2d');
			ctx.drawImage(this, 0, 0);
		}
		return cloned;
	}
	return e;
};
//
//	extra functions
//

//check if an element is within an element with a certain class
Elem.withinClass = function(el, cla){
	//check if cla in className
	if(el.className && el.className.indexOf(cla) >= 0){
		return true;
	}
	if(!el.parentNode){
		return false;
	}
	return this.withinClass(el.parentNode, cla);
}
