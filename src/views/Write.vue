<template>
	<div class="write">
		<a-card
				class="card"
				:bordered="false"
		>
			<h2>写动态</h2>
			<p>使用须知:</p>
			<p>1. 请勿发布违反法律的内容</p>
			<p>2. 请不要在动态中使用真实姓名</p>

			<editor :categories="categories" @get_list="push"/>
		</a-card>
	</div>
</template>

<script>
    import Editor from "../components/Editor";

    export default {
        name: "Write",
        components: {Editor},
        data() {
            return {
                categories: []
            }
        },
        beforeCreate() {
            const t = this
            this.$http.get('/categories')
                .then((response) => {
                    this.categories = response
                })
                .catch(function (error) {
                    t.$message.error(error.error)
                });
        },
        methods: {
            push() {
                return this.$router.push('/home')
            }
        }
    }
</script>

<style scoped>
	.write {
		margin: 0 auto;
	}
</style>
