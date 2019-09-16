<template>
	<div>
		<a-row>
			<a-col
					:xs="24"
					:sm="24"
					:md="12"
					:lg="8"
					:xl="8"
					:xxl="6"
					class="form-control"
			>
				<p>用户名</p>
				<a-input v-model="update.name"/>
			</a-col>
			<a-col
					:xs="24"
					:sm="24"
					:md="12"
					:lg="8"
					:xl="8"
					:xxl="6"
					class="form-control"
			>
				<p>邮箱</p>
				<a-input v-model="update.email"/>
			</a-col>
			<a-col
					:xs="24"
					:sm="24"
					:md="12"
					:lg="8"
					:xl="8"
					:xxl="6"
					class="form-control"
			>
				<p>密码</p>
				<a-input placeholder="留空则不修改" v-model="pwd"/>
			</a-col>
		</a-row>
		<div class="form-control submit-button">
			<a-button type="primary" @click="store">保存</a-button>
		</div>
	</div>
</template>

<script>
    export default {
        name: "ManageMe",
        data() {
            return {
                update: {},
                pwd: null
            }
        },
        beforeMount() {
            this.$http.get('/user')
                .then((response) => {
                    this.update = response
                })
                .catch(function (error) {
                    this.$message.error(error.error)
                });
        },
        methods: {
            store() {
                if (this.pwd) {
                    this.update.password = this.pwd
                }
                const t = this
                this.$http.post('/user', this.update)
                    .then(() => {
                        this.$message.success('更新完成')
                    })
                    .catch(function (error) {
                        t.$message.error(error.error)
                    });
            }
        }
    }
</script>

<style scoped>
	.form-control {
		padding: 5px;
	}

	.submit-button {
		float: right;
	}
</style>
