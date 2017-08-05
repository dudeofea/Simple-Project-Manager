<template>
<div class="developers">
	<h2 class="title">Servers</h2>
	<div class="btn add-edit-button" v-on:click="hub.$emit('modal-open')">Add</div>
	<table class="table table-striped">
		<thead>
			<tr>
				<td>Id</td>
				<td>Name</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for="s in servers">
				<td>{{s.id}}</td>
				<td>{{s.name}}</td>
			</tr>
		</tbody>
	</table>
	<create-modal
		v-bind:hub="hub"
		title="Server"
		v-bind:table="page_name">
	</create-modal>
</div>
</template>

<script>
import CreateModal from './create-modal.vue'
import logger from './logger.js'

export default {
	data: () => ({
		page_name: "servers",
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
