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
	constructor(private http_client: Http){
		this.http = http_client;
		this.refresh();
	}
	refresh(){
		this.http.get('api/developers').subscribe(res => {
			this.devs = res.json();
		});
	}
	add_edit(){
		this.editing = true;
		this.email = "hey hey";
		//TODO: create a new changeset either based on exising dev
		//TODO: or create a new cs based on /schema/developers endpoint
	}
	submit(){
		//TODO: submit the dev changeset
		// this.http.post('api/developers', {email: "a new email"}).subscribe(res => {
		// 	this.refresh();
		// });
	}
}
