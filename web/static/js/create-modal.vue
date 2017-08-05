<template>
<!-- //TODO: add close button / close when click overlay to modal -->
<div class="modal-wrapper" v-bind:class="{show : show}">
	<div class="back"></div>
	<div class="modal">
		<span class="close" v-on:click="close()">X</span>
		<h4>Create a new {{ title }}</h4>
		<div v-for="f in form_fields">
			<input type="text" class="form-input" :placeholder="f.title" v-model="form[f.property]"/>
		</div>
		<div class="btn" v-on:click="submit()">Create</div>
	</div>
</div>
</template>

<script>
import logger from './logger.js'
import Case from 'case'

export default {
	props: ['hub', 'title', 'table'],
	data: function(){
		return {
			show: false,
			form: {},
			form_fields: []
		}
	},
	created(){
		this.hub.$on('modal-open', this.open);
	},
	methods: {
		open: function(table){
			//load schema
			axios.get('schema/'+this.table)
			.then(response => {
				//get form fields, minus id and timestamps
				let ignore_fields = ["id", "inserted_at", "updated_at"],
					form_fields = [],
					blank = response.data.blank_form,
					field_types = response.data.fields;
				for (var f in blank) {
					if (blank.hasOwnProperty(f) && ignore_fields.indexOf(f) < 0) {
						//get field type
						let ft = field_types.find(function(x){
							return x.name == f
						})
						form_fields.push({property: f, title: Case.capital(f), type: ft.type})
					}
				}
				this.show = true
				this.form_fields = form_fields
			})
			.catch(logger(this))
		},
		close: function(){
			this.show = false
		},
		submit: function(){
			this.close()
			console.log(this.form)
			axios.post('crud/'+this.table, this.form)
			.then(response => {
				this.form = {}
				this.hub.$emit('modal-submit')
			})
			.catch(logger(this))
		}
	}
}
</script>
