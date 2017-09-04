//useful macros
var d = document;
// router code, all other scripts are imported asychronously
var sections_tree = [];
(function(){
	if(document.__ENV__ == "testing"){ return; }
	//build section tree
	var sections = d.getElementsByTagName('router-section');
	sections_tree = build_section_tree(sections);
	//add router-link click events
	var links = d.getElementsByTagName('router-link');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = link_click;
	}
})();
//change path based on router-link clicks
function link_click(e){
	//set ours to selected and none others
	var selected = d.getElementsByClassName('selected');
	for (var i = 0; i < selected.length; i++) {
		selected[i].classList.remove("selected");
	}
	e.target.classList.add("selected");
	//set the path of our page
	var path = e.target.getAttribute("path");
	if(!path){ return; }
	//if relative, add the scope path and stick with
	//sections_tree as root
	if(path[0] != '/'){
		path = getScope(e.target) + "/" + path;
		load_path(path, sections_tree);
	//if the path is absolute, find nearest router section
	//to use as root instead of sections_tree
	}else{
		load_path(path, getSection(sections_tree, e.target));
	}
};
//make an async GET request
function httpGET(theUrl, callback, error){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4)
	        if (xmlHttp.status == 200)
	            callback(xmlHttp.responseText);
			else
				error(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
};
//add a page to browser history
function pushToHistory(title, path){
    document.title = title;
    window.history.pushState(path.replace("/", "") ,title, path);
};
//used for forward/back in browser
window.onpopstate = function(e){
    // linkClick(window.location.href, true);
    // if(e.state){
    //     document.title = e.state.pageTitle;
    // }else{
    //     document.title = "Denis Lachance";
    // }
	//TODO: this
};
//load a given path without reloading (in-page)
function load_path(path, st, callback){
	_load_path(path, st, "", _copy_elem(st, function(){
		pushToHistory("A Title", path);
		if(callback)
			callback();
	}));
}
//apply the changes of _load_path to the DOM tree / section tree
function _copy_elem(st, callback){
	return function(subsection, st_i){
		if(subsection != null){
			//console.log("done", subsection.elem.outerHTML, st_i);
			//copy attributes of existing DOM element
			var attr = st[st_i].elem.attributes;
			for (var i = 0; i < attr.length; i++) {
				var a = attr.item(i);
				if(a.nodeName != "data-path")
					subsection.elem.setAttribute(a.nodeName, a.nodeValue);
			}
			//replace element in DOM
			st[st_i].elem.parentNode.replaceChild(subsection.elem, st[st_i].elem);
			st[st_i].elem = subsection.elem;
			st[st_i].children = subsection.children;
		}
		return callback();
	}
}
function _load_path(path, st, scope, callback){
	//ignore empty section trees
	if(!st){ return callback(); }
	//split path by slashes
	var split = path.split("/");
	//remove empty path components
	split = split.filter(function(s){
		return s.length > 0;
	});
	//don't load a path if it's already loaded
	if(st[0].elem.getAttribute("data-path") == split[0]){
		if(split.length > 1){
			var new_path = split.splice(1).join("/");
			scope += split[0] + "/";
			//console.log("calling back", scope, new_path, st[0].elem.outerHTML)
			var st = st[0].children;
			//don't touch this level, go one deeper
			return _load_path(new_path, st, scope, _copy_elem(st, callback));
		}
		return callback();
	}
	//console.log("requesting", "/sections/" + scope + split[0])
	httpGET("/sections/" + scope + split[0], function(resp){
		//make shadow element
		var section = document.createElement("router-section");
		section.innerHTML = resp;
		section.setAttribute("data-path", split[0]);
		//add link click event
		var links = section.getElementsByTagName('router-link');
		for (var i = 0; i < links.length; i++) {
			links[i].onclick = link_click;
		}
		//get children sections
		var children = build_section_tree(section.getElementsByTagName("router-section"));
		//load path again, one level deeper
		split.splice(0, 1);
		var new_path = split.join("/");
		//console.log("new path", new_path, resp);
		if(new_path.length > 0){
			//console.log("going down", new_path, children[0]);
			if(children.length > 0){
				return _load_path(new_path, children, scope, function(subsection, st_i){
					children[st_i].elem.innerHTML = subsection.elem.innerHTML;
					children[st_i].elem.setAttribute("data-path", new_path);
					//console.log("done loading sub path", new_path, subsection.elem.outerHTML);
					callback({
						elem: section,
						children: children
					}, 0);
				});
			}
		}
		//just pick the first one for now
		return callback({
			elem: section,
			children: children
		}, 0);
	}, function(error){
		console.log("GET error", error);
		callback();
	});
};
//checks if parent is a parent of child
function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
};
//get scope of an element
function getScope(elem){
	var scope = "";
	var node = elem.parentNode;
	while (node != null) {
		if(node.tagName == "ROUTER-SECTION"){
			scope += "/" + node.getAttribute("data-path");
		}
		node = node.parentNode;
	}
	return scope;
}
//get the nearest router section parent
function getSection(st, elem){
	for (var i = 0; i < st.length; i++) {
		if(isDescendant(st[i].elem, elem) && st[i].children && st[i].children.length > 0){
			st = st[i].children;
			i = 0;
		}
	}
	return st;
}
//print tree (for debugging)
function print_tree(tree, tab_level){
	if(!tab_level){ tab_level = 0; }
	for (var i = 0; i < tree.length; i++) {
		for (var j = 0; j < tab_level; j++) {
			process.stdout.write("\t");
		}
		process.stdout.write(tree[i].elem.tagName + " " + tree[i].elem.id + "\n");
		if(tree[i].children){
			print_tree(tree[i].children, tab_level+1);
		}
	}
};
//build tree of router-section elements to navigate to correct path
function build_section_tree(sections){
	var graph = {};
	//build dependency graph
	for (var i = 0; i < sections.length; i++) {
		for (var j = 0; j < sections.length; j++) {
			if(i == j){ continue; }
			if(isDescendant(sections[i], sections[j])){
				if(!graph[i]){
					graph[i] = [j];
				}else{
					graph[i].push(j);
				}
			}
		}
	}
	//build tree using reformatted graph
	var tree = [];
	for (var i = 0; i < sections.length; i++) {
		tree.push({elem: sections[i]});
	}
	//reformat graph/tree so it only has direct descendants
	for(var i in graph){
		var arr = graph[i];
		for (var j = 0; j < arr.length; j++) {
			if(graph[arr[j]]){
				var new_deps = arr.filter(function(n) {
					return graph[arr[j]].indexOf(n) === -1;
				});
				arr = new_deps;
			}
			if(!tree[i].children){
				tree[i].children = [tree[arr[j]]];
			}else{
				tree[i].children.push(tree[arr[j]]);
			}
			tree[arr[j]].disabled = true;
		}
	}
	//remove disabled nodes
	return tree.filter(function(t){
		return !t.disabled || t.disabled != true;
	});
};
