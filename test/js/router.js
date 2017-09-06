var assert = require('assert'),
	rewire = require('rewire'),
	MockBrowser = require('mock-browser').mocks.MockBrowser,
	jsdom = new MockBrowser()
	pretty = require('pretty');

document = jsdom.getDocument(),
document.__ENV__ = "testing",
window = jsdom.getWindow();
router = rewire("../../web/static/js/app.js");

function cleanHTML(html){
	return pretty(html
		.replace(/=\'(.*)\'/, "=\"$1\"")	//replace single quotes with doubles in element args
		.replace(/[\n\t]/g, "")				//remove newlines / tabs
		.replace(/\>\s+\</g, "")			//remove whitespaces between elements
		.replace(/ [^=]*=""/g, ""))			//remove empty attributes
}

assert.htmlEqual = function(htmlA, htmlB){
	assert.equal(
		cleanHTML(htmlA),
		cleanHTML(htmlB)
	);
};

describe('Tent Router', function() {
	var build_section_tree = router.__get__("build_section_tree");
	var load_path = router.__get__("load_path");
	var link_click = router.__get__("link_click");

	//override GET function
	var httpGETresponse;
	router.__set__("httpGET", function httpGET(url, callback){
		callback(httpGETresponse[url]);
	});
	//override window.history
	var window_history
	router.__set__("pushToHistory", function pushToHistory(title, path){
		window_history.push({path: path, title: title});
	});

	beforeEach(function(){
		window_history = [];
		httpGETresponse = {};
	});

	it('Should build a simple section tree', function() {
		document.body.innerHTML = `
		<router-section id="a">
			hey
		</router-section>`;
		var sections = document.getElementsByTagName('router-section');
		var tree = build_section_tree(sections);
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("a", tree[0].elem.id);
	});

	it('Should detect nested router-sections', function() {
		document.body.innerHTML = `
		<router-section id="a">
			hey
			<router-section id="b">
				hey2
			</router-section>
		</router-section>`;
		var sections = document.getElementsByTagName('router-section');
		var tree = build_section_tree(sections);
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("a", tree[0].elem.id);
		assert.notEqual(null, tree[0].children);
		assert.equal(1, tree[0].children.length);
		assert.notEqual(null, tree[0].children[0].elem);
		assert.equal("b", tree[0].children[0].elem.id);
	});

	it('Should handle multiple nested elements', function() {
		document.body.innerHTML = `
		<router-section id="a">
			hey
			<router-section id="b">
				hey2
				<router-section id="c">
					hey3
					<router-section id="d">
						hey4
						<router-section id="e">
							hey5
						</router-section>
					</router-section>
				</router-section>
				<router-section id="f">
					hey6
				</router-section>
			</router-section>
		</router-section>`;
		var sections = document.getElementsByTagName('router-section');
		var tree = build_section_tree(sections);
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("a", tree[0].elem.id);
		assert.notEqual(null, tree[0].children);

		var tree = tree[0].children;
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("b", tree[0].elem.id);
		assert.notEqual(null, tree[0].children);

		var tree = tree[0].children;
		assert.equal(2, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("c", tree[0].elem.id);
		assert.notEqual(null, tree[0].children);
		assert.notEqual(null, tree[1].elem);
		assert.equal("f", tree[1].elem.id);
		assert.equal(null, tree[1].children);

		var tree = tree[0].children;
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("d", tree[0].elem.id);
		assert.notEqual(null, tree[0].children);

		var tree = tree[0].children;
		assert.equal(1, tree.length);
		assert.notEqual(null, tree[0].elem);
		assert.equal("e", tree[0].elem.id);
		assert.equal(null, tree[0].children);
	});

	it('Should load router sections using a given path (simple)', function(){
		document.body.innerHTML = `
		<router-section>
			<p>not cats</p>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {"/sections/cats": "<p>cats</p>"};
		load_path("/cats", st, function(){
			assert.equal(st[0].elem.innerHTML, "<p>cats</p>");
			assert.equal(window_history.length, 1);
			assert.equal(window_history[0].path, "/cats");
		});
	});

	it('Should load router sections using a given path (nested)', function(){
		document.body.innerHTML = `
		<router-section>
			<p>not cats</p>
		</router-section>`;
		var ans = `
		<router-section path="cats">
			<p>cats</p>
			<router-section path="snookum">
				<p>Snookum</p>
			</router-section>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<p>cats</p><router-section><p>not Snookum</p></router-section>",
			"/sections/cats/snookum": "<p>Snookum</p>"
		};
		load_path("/cats/snookum", st, function(){
			assert.htmlEqual(st[0].elem.innerHTML, `<p>cats</p><router-section path="snookum"><p>Snookum</p></router-section>`);
			assert.htmlEqual(st[0].children[0].elem.innerHTML, "<p>Snookum</p>");
			assert.htmlEqual(document.body.innerHTML, ans);
			assert.equal(window_history.length, 1);
			assert.equal(window_history[0].path, "/cats/snookum");
		});
	});

	it('Should match with the first available router section by default', function(){
		document.body.innerHTML = `
		<router-section>
			<p>not cats</p>
		</router-section>
		<router-section>
			<p>also not cats</p>
		</router-section>`;
		var ans = `
		<router-section path="cats">
			<p>cats</p>
		</router-section>
		<router-section>
			<p>also not cats</p>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<p>cats</p>"
		};
		load_path("/cats", st, function(){
			assert.htmlEqual(document.body.innerHTML, ans);
		});
	});

	it('Should return a working DOM node tree', function(){
		document.body.innerHTML = `<router-section></router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/my": `
			<router-section id="5" class="my-class" data-random="hey">
				<p>not cats</p>
			</router-section>`,
			"/sections/cats": "<p class='text'>cats</p>"
		};
		load_path("/my/cats", st, function(){
			var elem = st[0].elem.getElementsByClassName("my-class")[0]
			assert.notEqual(elem, null);
			assert.equal(elem.id, "5");
			assert.equal(elem.getAttribute("data-random"), "hey");
			//check that children are still linked to the document
			assert.notEqual(st[0].children[0].elem.parentNode.parentNode, null);
		});
	});

	it('Should not mess with root <router-section> DOM element', function(){
		document.body.innerHTML = `<router-section data-hey="yo" id="myid4545" class="heyo zoinks" things="other things"></router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/hey": ""
		};
		load_path("/hey", st, function(){
			var elem = st[0].elem;
			assert.notEqual(elem, null);
			assert.equal(elem.getAttribute("data-hey"), "yo");
			assert.equal(elem.id, "myid4545");
			assert.equal(elem.className, "heyo zoinks");
			assert.equal(elem.getAttribute("things"), "other things");
		});
	});

	it('Should not request the same path twice', function(){
		document.body.innerHTML = `<router-section></router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<p class='text'>cats</p>"
		};
		load_path("/cats", st, function(){
			httpGETresponse = {
				"/sections/cats": "<p class='text'>not cats</p>"
			};
			load_path("/cats", st, function(){
				assert.htmlEqual(st[0].elem.innerHTML, "<p class='text'>cats</p>");
				assert.equal(st[0].elem.getAttribute("path"), "cats");
			});
		});
	});

	//noticed a bug when going from /developers to /projects and back
	it('Should be able to switch paths', function(){
		document.body.innerHTML = `<router-section></router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<p class='text'>some cats</p>",
			"/sections/dogs": "<p class='text'>some dogs</p>"
		};
		//no need to nest, should run serially
		load_path("/cats", st);
		load_path("/dogs", st);
		assert.htmlEqual(st[0].elem.outerHTML, `
			<router-section path="dogs">
				<p class='text'>some dogs</p>
			</router-section>
		`);
	});

	it('Should load relative templates declared on router-section', function(){
		document.body.innerHTML = `
		<router-section path="dogs">
			<router-link path="cats" id="nested"></router-link>
			<router-section template="cats-dynamic"></router-section>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));
		router.__set__("sections_tree", st);

		httpGETresponse = {
			"/sections/dogs/cats-dynamic": "<p class='text'>this is some text</p>"
		};
		link_click({target: document.getElementById("nested")});
		assert.htmlEqual(st[0].elem.outerHTML, `
			<router-section path="dogs">
				<router-link path="cats" id="nested" class="selected"></router-link>
				<router-section path="cats" template="cats-dynamic">
					<p class='text'>this is some text</p>
				</router-section>
			</router-section>
		`);
	});

	it('Should load absolute templates declared on router-section', function(){
		document.body.innerHTML = `
		<router-section path="dogs">
			<router-link path="cats" id="nested"></router-link>
			<router-section template="/cats-static"></router-section>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));
		router.__set__("sections_tree", st);

		httpGETresponse = {
			"/sections/cats-static": "<p class='text'>this is some more text</p>"
		};
		link_click({target: document.getElementById("nested")});
		assert.htmlEqual(st[0].elem.outerHTML, `
			<router-section path="dogs">
				<router-link path="cats" id="nested" class="selected"></router-link>
				<router-section path="cats" template="/cats-static">
					<p class='text'>this is some more text</p>
				</router-section>
			</router-section>
		`);
	});

	it('Adds click event to router-link functions even when loaded from router-section', function(){
		document.body.innerHTML = `<router-section></router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<router-link path='dogs' id='my-link'></router-link><router-section></router-section>"
		};
		load_path("/cats", st);
		var link = document.getElementById("my-link");
		assert.equal(link.onclick, link_click);
	});

	//based on a bug found in browser
	it('Should load nested sections even after switching', function(){
		document.body.innerHTML = `
		<router-link id="btn1" path="developers">Add</router-link>
		<router-link id="btn2" path="projects">Add</router-link>
		<router-section path="projects">
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="create">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));
		router.__set__("sections_tree", st);

		httpGETresponse = {
			"/sections/projects": `
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="create">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>`,
			"/sections/developers": "",
			"/sections/projects/create": "<form>create</form>"
		};
		link_click({target: document.getElementById("btn1")});
		link_click({target: document.getElementById("btn2")});
		link_click({target: document.getElementById("btn3")});
		assert.htmlEqual(document.body.innerHTML, `
			<router-link id="btn1" path="developers">Add</router-link>
			<router-link id="btn2" path="projects">Add</router-link>
			<router-section path="projects">
				<div class="projects">
					<h2 class="title">Projects</h2>
					<router-link id="btn3" path="create" class="selected">Add</router-link>
					<router-section path="create" data-match="create"><form>create</form></router-section>
				</div>
			</router-section>
		`);
	});

	it('Should reload /projects from /projects/create', function(){
		document.body.innerHTML = `
		<router-link id="btn1" path="developers">Add</router-link>
		<router-link id="btn2" path="projects" reload="true">Add</router-link>
		<router-section path="projects">
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="create">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));
		router.__set__("sections_tree", st);

		httpGETresponse = {
			"/sections/projects": `
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="create">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>`,
			"/sections/developers": "",
			"/sections/projects/create": "<form>create</form>"
		};
		link_click({target: document.getElementById("btn1")});
		link_click({target: document.getElementById("btn2")});
		link_click({target: document.getElementById("btn3")});
		link_click({target: document.getElementById("btn2")});
		assert.htmlEqual(document.body.innerHTML, `
			<router-link id="btn1" path="developers">Add</router-link>
			<router-link id="btn2" path="projects" reload="true" class="selected">Add</router-link>
			<router-section path="projects">
				<div class="projects">
					<h2 class="title">Projects</h2>
					<router-link id="btn3" path="create">Add</router-link>
					<router-section data-match="create"></router-section>
				</div>
			</router-section>
		`);
	});

	it('Should be able to override router-link scope', function(){
		document.body.innerHTML = `
		<router-section path="projects">
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="/developers">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));
		router.__set__("sections_tree", st);

		httpGETresponse = {
			"/sections/projects": `
			<div class="projects">
				<h2 class="title">Projects</h2>
				<router-link id="btn3" path="create">Add</router-link>
				<router-section data-match="create"></router-section>
			</div>`,
			"/sections/developers": "",
			"/sections/projects/create": "<form>create</form>"
		};
		link_click({target: document.getElementById("btn3")});
		assert.htmlEqual(document.body.innerHTML, `
			<router-section path="developers"></router-section>
		`);
	});

	//TODO: it('Should cache inactive router sections in a <router-cache> element in the body')
	//TODO: it('Should work with single match paths'), make sure you don't test the first element to trick it
	//TODO: it('Should work with regex matching paths')
});
