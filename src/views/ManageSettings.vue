<template>
	<a-card>
		<h2>全局设置</h2>
		<div class="form-control">
			<label>公告</label>
			<a-textarea v-model="update.notice"/>
		</div>
		<div class="form-control submit-button">
			<a-button type="primary" @click="store">保存</a-button>
		</div>
	</a-card>
</template>

<script>
    export default {
        name: "ManageSettings",
        data() {
            return {
                update: {}
            }
        },
        beforeMount() {
            this.$http.get('/settings')
                .then((response) => {
                    this.update = response
                })
                .catch(function (error) {
                    this.$message.error(error.error)
                });
        },
        methods: {
            store() {
                const t = this
                this.$http.post('/settings', this.update)
                    .then(() => {
                        this.$message.success('更新完成')
                    })
                    .catch(function (error) {
                        t.$message.error(error.errors)
                    });
            }
        }
    }
</script>

<style scoped>
	.form-control {
		padding: 5px;
		max-width: 300px;
	}

	.submit-button {
		float: right;
	}
</style>
