//
//  Automatic Forms Generation
//
//  Forms are created based on elixir models for that type, via the API.
//  This also handles submitting forms
//

Form = function(el, model_url){
	var f = {
		elem: el, model_url: model_url,
		submit: function(){
			//gather inputs from form
			var form = this.schema.blank_form;
			var post_data = {};
			for (var i = 0; i < form.length; i++) {
				post_data[form[i].name] = form[i].elem.value;
			}
			Ajax.post("/crud/"+model_url, post_data, "POST");
		}
	}
	//get model info from schema API and add form elements
	console.log("creating form", el, model_url);
	require("elem", function(){
	require("ajax", function(){
		Ajax.get("/schema/"+model_url, function(s){
			var schema = JSON.parse(s);
			var fields = el.getElementsByClassName("fields")[0]
			for (var i = 0; i < schema.blank_form.length; i++) {
				var field = schema.fields.find(function(f){
					return f.name == schema.blank_form[i].name;
				});
				var f_elem = Elem("div", {class: "field"});
				var label = Elem("label", null, field.label);
				var input = Form.getInput(field);
				schema.blank_form[i].elem = input;
				f_elem.appendChild(label);
				f_elem.appendChild(input);
				fields.appendChild(f_elem);
			}
			f.schema = schema;
		})
	})
	})
	return f;
}

//returns an input element for a certain type of field
Form.getInput = function(input){
	console.log(input);
	var input = Elem("input", {type: "text", name: input.name});
	return input;
};
