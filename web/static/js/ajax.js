Ajax = {
	post: function(theUrl, params, callback) {
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() {
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	            if(callback){
					callback(xmlHttp.responseText);
				}
			}
	    }
	    xmlHttp.open("POST", theUrl, true); // true for asynchronous
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlHttp.send(Ajax.serialize(params));
	},
	get: function httpGetAsync(theUrl, callback){
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() {
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	            callback(xmlHttp.responseText);
			}
	    }
	    xmlHttp.open("GET", theUrl, true); // true for asynchronous
	    xmlHttp.send(null);
	},
	serialize: function(obj) {
		var str = [];
		for (var p in obj){
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		}
		return str.join("&");
	}
}
