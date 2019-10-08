<template>
	<div class="post">
		<post-page :id="$route.params.id"/>
	</div>
</template>

<script>
    import PostPage from "../components/PostPage";
    export default {
        name: "Post",
        components: {PostPage}
    }
</script>

<style scoped>
	.post {
		margin: 0 auto;
		padding: 20px;
		max-width: 800px;
		background: transparent;
	}
</style>
