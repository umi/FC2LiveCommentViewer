<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'livecomment-el'
	}
</script>

<style lang="scss">
	body {
		font-family: arial,'Hiragino kaku Gothic Pro',Meiryo,'Yu Gothic',sans-serif;
	}
	body, html {
		height: 100%;
		margin: 0;
	}
	#app, #config {
		height: 100%;
	}
</style>
