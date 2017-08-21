var assert = require('assert'),
	rewire = require('rewire'),
	MockBrowser = require('mock-browser').mocks.MockBrowser,
	jsdom = new MockBrowser();

document = jsdom.getDocument(),
document.__ENV__ = "testing",
window = jsdom.getWindow();
router = rewire("../../web/static/js/app.js");

describe('Tent Router', function() {
	var build_section_tree = router.__get__("build_section_tree");
	var load_path = router.__get__("load_path");

	//override GET function
	var httpGETresponse;
	router.__set__("httpGET", function(url, callback){
		callback(httpGETresponse[url]);
	});
	//override window.history
	var window_history
	router.__set__("pushToHistory", function(title, path){
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
		<router-section>
			<p>cats</p>
			<router-section>
				<p>Snookum</p>
			</router-section>
		</router-section>`;
		var st = build_section_tree(document.getElementsByTagName('router-section'));

		httpGETresponse = {
			"/sections/cats": "<p>cats</p><router-section><p>not Snookum</p></router-section>",
			"/sections/snookum": "<p>Snookum</p>"
		};
		load_path("/cats/snookum", st, function(){
			assert.equal(st[0].elem.innerHTML, "<p>cats</p><router-section><p>Snookum</p></router-section>");
			assert.equal(st[0].children[0].elem.innerHTML, "<p>Snookum</p>");
			assert.equal(document.body.innerHTML.replace(/\s/g, ""), ans.replace(/\s/g, ""));
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
		<router-section>
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
			assert.equal(document.body.innerHTML.replace(/\s/g, ""), ans.replace(/\s/g, ""));
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
});
