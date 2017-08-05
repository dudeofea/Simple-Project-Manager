<template>
<div class="developers">
	<h2 class="title">Projects</h2>
	<div class="btn add-edit-button" v-on:click="hub.$emit('modal-open')">Add</div>
	<table class="table table-striped">
		<thead>
			<tr>
				<td>Id</td>
				<td>Name</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for="p in projects">
				<td>{{p.id}}</td>
				<td>{{p.name}}</td>
			</tr>
		</tbody>
	</table>
	<create-modal
		v-bind:hub="hub"
		title="Project"
		v-bind:table="page_name">
	</create-modal>
</div>
</template>

<script>
import CreateModal from './create-modal.vue'
import logger from './logger.js'

export default {
	data: () => ({
		page_name: "projects",
		devs: [],
		error: null,
		hub: new Vue()
	}),
	created() {
		this.refresh();
		this.hub.$on('modal-submit', this.refresh);
	},
	methods: {
		refresh: function(){
			axios.get('crud/'+this.page_name)
			.then(response => {
				this.devs = response.data
			})
			.catch(logger(this))
		}
	},
	components: {
		'create-modal': CreateModal
	}
}
</script>
