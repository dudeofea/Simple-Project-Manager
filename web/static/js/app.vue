<template>
<div class="app">
	<site-header></site-header>
	<router-view></router-view>
</div>
</template>

<script>
import Header from './header.vue'

export default {
	components: {
		'site-header': Header
	}
}
</script>
