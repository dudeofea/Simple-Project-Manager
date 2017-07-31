<template>
<div class="developers">
	<h2 class="title">Developers</h2>
	<div class="btn add-edit-button">Add</div>
	<!--<table class="table table-striped">
		<thead>
			<tr>
				<td>Id</td>
				<td>Email</td>
			</tr>
		</thead>
		<tbody>
			<tr *ngFor="let d of devs">
				<td>{{d.id}}</td>
				<td>{{d.email}}</td>
			</tr>
		</tbody>
	</table>-->
	<!-- //TODO: add close button / close when click overlay to modal -->
	<div class="modal-wrapper">
		<div class="back"></div>
		<div class="modal">
			<span class="close">X</span>
			<h4>Create a new Developer</h4>
			<input type="text" class="form-input" placeholder="Email"/>
			<div class="btn">Create</div>
		</div>
	</div>
</div>
</template>

<script>
let page_name = "developers"

export default {
	data: () => ({
		posts: [],
		errors: []
	}),
	created() {
		axios.get('crud/'+page_name)
		.then(response => {
			console.log(response)
			// JSON responses are automatically parsed.
			this.posts = response.data
		})
		.catch(e => {
			this.errors.push(e)
		})
	}
}
</script>
