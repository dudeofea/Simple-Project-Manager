//useful macros
var d = document;
d.$tag = d.getElementsByTagName;
d.$class = d.getElementsByClassName;
d.$id = d.getElementById;
// router code, all other scripts are imported asychronously
var links = [];
var sections_tree = [];
(function(){
	if(document.__ENV__ == "testing"){ return; }
	links = d.$tag('router-link');
	var sections = d.$tag('router-section');
	sections_tree = build_section_tree(sections);
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = link_click;
	}
})();
//change path based on router-link clicks
function link_click(e){
	//set ours to selected and none others
	var selected = d.$class('selected');
	for (var i = 0; i < selected.length; i++) {
		selected[i].classList.remove("selected");
	}
	e.target.classList.add("selected");
	//set the path of our page
	var path = e.target.getAttribute("path");
	load_path(path, sections_tree);
};
//make an async GET request
function httpGET(theUrl, callback, error){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
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
	_load_path(path, st, false, function(subsection, st_i){
		console.log("all done", subsection, st, st_i);
		st[st_i].elem.innerHTML = subsection.elem.innerHTML;
		st[st_i].children = subsection.children;
		pushToHistory("A Title", path);
		callback();
	});
}
function _load_path(path, s_node, shadow, callback){
	//split path by slashes
	var split = path.split("/");
	//remove empty path components
	split = split.filter(function(s){
		return s.length > 0;
	});
	console.log("requesting", split[0])
	httpGET("/sections/" + split[0], function(resp){
		//make shadow element
		var section = document.createElement("div");
		section.innerHTML = resp;
		//load path again, one level deeper
		split.splice(0, 1);
		var new_path = split.join("/");
		console.log("new path", new_path, resp);
		if(new_path.length > 0){
			//rebuild router-section tree
			var children = build_section_tree(section.getElementsByTagName("router-section"));
			console.log("going down", new_path, children[0]);
			_load_path(new_path, children[0], true, function(subsection){
				children[0].elem.innerHTML = subsection.elem.innerHTML;
				console.log("going up", new_path, children);
				callback({
					elem: section,
					children: children
				}, 0);
			});
		//if we're done (no more path to load)
		}else{
			//just pick the first one for now
			callback({
				elem: section
			}, 0);
		}
	}, function(error){
		console.log("GET error", error);
		callback();
	});
};
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
