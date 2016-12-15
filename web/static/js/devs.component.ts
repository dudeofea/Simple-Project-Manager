import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HTTP_PROVIDERS, Http } from '@angular/http';

@Component({
	selector: 'developers',
	templateUrl: 'templates/developers.html'
})

export class DevsComponent {
	devs: Object[];
	http: Http;
	editing = false;
	public form = {};
	constructor(private http_client: Http){
		this.http = http_client;
		this.refresh();
	}
	refresh(){
		this.http.get('crud/developers').subscribe(res => {
			this.devs = res.json();
		});
	}
	add_edit(){
		this.http.get('schema/developers').subscribe(res => {
			this.editing = true;
			this.form = res.json().blank_form;
		});
		//TODO: create a new changeset either based on exising dev
		//TODO: or create a new cs based on /schema/developers endpoint
	}
	submit(){
		//submit the dev changeset
		this.http.post('crud/developers', this.form).subscribe(res => {
			this.refresh();
			this.close();
		});
	}
	close(){
		this.editing = false;
	}
}
