<template>
	<a-card :bordered="false" class="card about">
		<h2>关于</h2>
        <p v-text="about"></p>
		<h1 style="text-align: center; font-weight: 200">Project uSilo</h1>
		<p>uSilo - 语闲</p>
		<p>Version 1.0(Pre-Release)</p>
		<p>类树洞的内部吹水系统</p>
		<p>请注意，本软件为开源程序，任何人可以访问本程序的源代码，并可使用代码克隆出多个站点。因此，用户在站点内发布的任何言论与开发者无关。</p>
		<p>Developed by 0xJacky</p>
		<h1 style="text-align: center; font-weight: 200">I love Open Source</h1>
		<p>程序</p>
		<p>根据开源许可，任何对源码的更改均需要向实际用户提供修改后的源码（包括网络分发），在未经软件作者本人同意的情况下，不得用于商业用途。</p>
	</a-card>
</template>

<script>
    export default {
        name: "About",
        data() {
            return {
                about: ''
            }
        },
        activated() {
            const t = this
            this.$http.get('/about')
                .then((response) => {
                    this.about = response.about
                })
                .catch(function (error) {
                    t.$message.error(error)
                });
        },
    }
</script>

<style scoped>

</style>
