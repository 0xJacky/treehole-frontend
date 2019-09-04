<template>
	<div class="manage">
		<a-button @click="logout">注销</a-button>
		<a-menu
				v-model="current"
				mode="horizontal"
				class="categories-menu center"
		>
			<a-menu-item key="/admin/category" @click="$router.push('/admin/category')">
				分类
			</a-menu-item>
			<a-menu-item key="/admin/report" @click="$router.push('/admin/report')">
				举报
			</a-menu-item>
			<a-menu-item key="/admin/me" @click="$router.push('/admin/me')">
				个人设置
			</a-menu-item>
			<a-menu-item key="/admin/settings" @click="$router.push('/admin/settings')">
				全局设置
			</a-menu-item>
		</a-menu>
		<a-card class="card manage-panel" title="管理" :bordered="false">
			<router-view></router-view>
		</a-card>
	</div>
</template>

<script>
    export default {
        name: "Manage",
        data() {
            return {
                current: [this.$route.path]
            }
        },
        watch: {
            'route'() {
                this.current = [this.$route.path]
            }
        },
        methods: {
            logout() {
                this.$http.delete('/authorizations/current')
                    .then(() => {
                        this.$store.dispatch('logout')
                        this.$message.success('注销成功')
                        this.$router.push('/home')
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            }
        }
    }
</script>

<style scoped>
	.manage-panel {
		margin: 30px 0;
	}
</style>
