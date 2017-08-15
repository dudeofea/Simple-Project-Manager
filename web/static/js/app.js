// router code, all other scripts are imported asychronously
var links = [];
var sections_tree = [];
(function(){
	if(document.__ENV__ == "testing"){ return; }
	links = document.getElementsByTagName('router-link');
	var sections = document.getElementsByTagName('router-section');
	sections_tree = build_section_tree(sections);
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = link_click;
	}
})();
//change path based on router-link clicks
function link_click(e){
	//set ours to selected and none others
	var selected = document.getElementsByClassName('selected');
	for (var i = 0; i < selected.length; i++) {
		selected[i].classList.remove("selected");
	}
	e.target.classList.add("selected");
	//set the path of our page
	var path = e.target.getAttribute("path");
	load_path(path);
};
//load a given path without reloading (in-page)
function load_path(path){

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
	//reformat graph so it only has direct descendants
	for(var i in graph){
		var arr = graph[i];
		for (var j = 0; j < arr.length; j++) {
			if(graph[arr[j]]){
				var new_deps = graph[i].filter(function(n) {
					return graph[arr[j]].indexOf(n) === -1;
				});
				graph[i] = new_deps;
			}
		}
	}
	//build tree using reformatted graph
	var tree = [];
	for (var i = 0; i < sections.length; i++) {
		tree.push({elem: sections[i]});
	}
	for (var i in graph) {
		for (var j = 0; j < graph[i].length; j++) {
			if(!tree[i].children){
				tree[i].children = [tree[graph[i][j]]];
			}else{
				tree[i].children.push(tree[graph[i][j]]);
			}
			tree[graph[i][j]].disabled = true;
		}
	}
	//remove disabled nodes
	tree = tree.filter(function(t){
		return !t.disabled;
	});
	return tree;
};
