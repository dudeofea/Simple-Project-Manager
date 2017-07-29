import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Http } from '@angular/http';

let page_name = "tickets";

@Component({
	selector: page_name,
	templateUrl: 'templates/'+page_name+'.html'
})

export class TicketsComponent {
	projects: Object[];
	http: Http;
	editing = false;
	public form = {};
	constructor(private http_client: Http){
		this.http = http_client;
		this.refresh();
	}
	refresh(){
		this.http.get('crud/'+page_name).subscribe(res => {
			this.projects = res.json();
		});
	}
	add_edit(){
		this.http.get('schema/'+page_name).subscribe(res => {
			this.editing = true;
			this.form = res.json().blank_form;
		});
		//TODO: create a new changeset either based on exising dev
		//TODO: or create a new cs based on /schema/developers endpoint
	}
	submit(){
		//submit the dev changeset
		this.http.post('crud/'+page_name, this.form).subscribe(res => {
			this.refresh();
			this.close();
		});
	}
	close(){
		this.editing = false;
	}
}
