//
//  Automatic Forms Generation
//
//  Forms are created based on elixir models for that type, via the API.
//  This also handles submitting forms
//

Form = function(el, model_url){
	//get model info from schema API and add form elements
	console.log("creating form", el, model_url);
	require("elem", function(){
	require("ajax", function(){
		Ajax.get("/schema/"+model_url, function(s){
			var schema = JSON.parse(s);
			var fields = el.getElementsByClassName("fields")[0]
			console.log(schema, fields);
			for (var i = 0; i < schema.blank_form.length; i++) {
				var field = schema.fields.find(function(f){
					return f.name == schema.blank_form[i].name;
				});
				console.log(schema.blank_form[i], field);
				var f_elem = Elem("div", "field");
				var label = Elem("label", "", field.label);
				var input = Form.getInput(field);
				f_elem.appendChild(label);
				f_elem.appendChild(input);
				fields.appendChild(f_elem);
			}
		})
	})
	})
}

//returns an input element for a certain type of field
Form.getInput = function(input){
	var input = Elem("input");
	return input;
}
