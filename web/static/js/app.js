//
//	Each web page is organized into several <router-section> elements,
//	they can be as big or small as needed, the point is to reuse them. Each
//	section has 2 main properties:
//		- path: the path to match to activate this section, examples:
//			"/", "*", "/dogs/*", "/cats"
//		- template: the location to fetch the template, if not provided then
//			template = path and a request for that section will be made as such.
//			so if your back-end can handle "/dogs/*.html" then cool, otherwise you
//			might want to define a template like "/dogs.html". if "/dogs/45" is the
//			path selected, we will include that in the request for you to use under
//			a GET body attributes called "path" (much naming, such terse)
//
//	You can of course nest sections, if you have a section with path "/create" inside
//	a section called "/projects", going to the location (URL) "/projects/create" will
//	bring you there.
//
//	The second part of sections is the <router-link> element, it essentially does
//	the same thing as <a> except relative paths (those that don't start with /)
//	will load based on the scope of the link. Example:
//
//	<router-section path="/foo">
//		<router-link path="bar">
//		<router-link path="/baz">
//		<router-link path="../boz">
//	</router-section>
//
//	Links to "/foo/bar", "/baz", and "/boz" respectively. The last one is useful if you
//	want to undo some of the nesting the link is in but not all of it. It essentially
//	works the same as file directories
//
//	The template param for sections is also subject to scope, so:
//
//	<router-section path="/animal">
//		<router-section path="cat"></router-section>
//		<router-section path="dog" template="/dog.html"></router-section>
//		<router-section path="iguana" template="../iguana-template"></router-section>
//	</router-section>
//
//	Will be triggered on requests for "/animal/cat", "/animal/dog", and "/animal/iguana"
//	And their templates will be requested from "/animal/cat", "/dog.html", and "/iguana-template"
//	when loading the section. Basically the user makes a request for "/animal/dog" and we know
//	to fetch (no pun intended) "/dog.html" to get that section's content. When loading a full
//	page, the back-end should be able to pre-load all required sections into a single html
//	page to speed up the initial page load
//
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
	add_link_events(d);
})();
//add onclick event to all router-link found in elem
function add_link_events(elem){
	var links = elem.getElementsByTagName('router-link');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = link_click;
	}
	links = elem.getElementsByClassName('router-link');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = link_click;
	}
}
//change path based on router-link clicks
function link_click(e){
	var el = e.target;
	//trigger the pretrigger event handler
	var pretrigger = el.getAttribute("pretrigger");
	if(window[pretrigger] != null){
		window[pretrigger](e);
	}
	//set ours to selected and none others
	var selected = d.getElementsByClassName('selected');
	for (var i = 0; i < selected.length; i++) {
		selected[i].classList.remove("selected");
	}
	el.classList.add("selected");
	//set the path of our page
	var path = el.getAttribute("path");
	if(!path){ return; }
	var reload = (el.getAttribute("reload") != null);
	//if relative, add the scope path and stick with
	//sections_tree as root
	if(path[0] != '/'){
		path = getScope(el) + "/" + path;
		load_path(path, {tree: sections_tree, reload: reload});
	//if the path is absolute, find nearest router section
	//to use as root instead of sections_tree
	}else{
		load_path(path, {tree: sections_tree, reload: reload});
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
function pushToHistory(path){
    window.history.pushState({path: path, title: document.title}, null, path);
};
//used for forward/back in browser
window.onpopstate = function(e){
	load_path(e.state.path, {tree: sections_tree, reload: true});
	document.title = e.state.title;
};
//load a given path without reloading (in-page)
function load_path(path, args, callback){
	if(!args){ args = {}; }
	//if(!args.tree){ args.tree = sections_tree; }
	args.scope = "";
	//console.log("loading", path);
	_load_path(path, args.tree, args, _copy_elem(args.tree, function(){
		//console.log("loaded", path);
		pushToHistory(path);
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
				if(a.nodeName != "path")
					subsection.elem.setAttribute(a.nodeName, a.nodeValue);
			}
			//replace element in DOM
			st[st_i].elem.parentNode.replaceChild(subsection.elem, st[st_i].elem);
			st[st_i].elem = subsection.elem;
			st[st_i].children = subsection.children;
			//run JS in script tags
			var scripts = st[st_i].elem.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				eval(scripts[i].innerHTML);
			}
		}
		return callback();
	}
}
function _load_path(path, st, args, callback){
	//ignore empty section trees
	if(!st){ return callback(); }
	//split path by slashes
	var split = path.split("/");
	//remove empty path components
	split = split.filter(function(s){
		return s.length > 0;
	});
	//get template path
	var template = st[0].elem.getAttribute("template");
	if(!template){
		template = '/' + args.scope + split[0];
	}else if(template[0] != '/'){
		template = '/' + args.scope + template;
	}
	//make scope one level deeper
	args.scope += split[0] + "/";
	//don't load a path if it's already loaded, unless we're reloading
	if(!args.reload && st[0].elem.getAttribute("path") == split[0]){
		if(split.length > 1){
			var new_path = split.splice(1).join("/");
			//console.log("calling back", args.scope, new_path, st[0].elem.outerHTML)
			var st = st[0].children;
			//don't touch this level, go one deeper
			return _load_path(new_path, st, args, _copy_elem(st, callback));
		}
		return callback();
	}
	//console.log("requesting", "/sections" + template)
	httpGET("/sections" + template, function(resp){
		//make shadow element
		var section = document.createElement("router-section");
		section.innerHTML = resp;
		section.setAttribute("path", split[0]);
		//add link click events
		add_link_events(section);
		//get children sections
		var children = build_section_tree(section.getElementsByTagName("router-section"));
		//load path again, one level deeper
		split.splice(0, 1);
		var new_path = split.join("/");

		//console.log("new path", new_path, resp);
		if(new_path.length > 0){
			//console.log("going down", new_path, children[0], args);
			if(children.length > 0){
				return _load_path(new_path, children, args, function(subsection, st_i){
					children[st_i].elem.innerHTML = subsection.elem.innerHTML;
					children[st_i].elem.setAttribute("path", new_path);
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
			scope += "/" + node.getAttribute("path");
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
