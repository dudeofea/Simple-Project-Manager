import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'create-modal',
	templateUrl: "templates/create.modal.html"
})

export class CreateModal {
	table: String;
	http: Http;
	editing = false;
	public form = {};
	public on_submit: Function;
	constructor(private http_client: Http, table_name: String){
		this.http = http_client;
		this.table = table_name;
	}
	add_edit(){
		this.http.get('schema/'+this.table).subscribe(res => {
			this.editing = true;
			this.form = res.json().blank_form;
		});
		//TODO: create a new changeset either based on exising dev
		//TODO: or create a new cs based on /schema/developers endpoint
	}
	submit(){
		//submit the dev changeset
		this.http.post('crud/'+this.table, this.form).subscribe(res => {
			this.on_submit();
			this.close();
		});
	}
	close(){
		this.editing = false;
	}
}
