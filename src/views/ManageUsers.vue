<template>
	<a-card class="manage-users">
		<h2>用户</h2>
		<a-button @click="create" style="margin: 5px 0">添加用户</a-button>
		<div v-show="show_editor">
			<a-input-group>
				<a-col :span="6">
					<label>昵称</label>
					<a-input v-model="update.name"/>
				</a-col>

				<a-col :span="9">
					<label>邮箱</label>
					<a-input v-model="update.email"/>
				</a-col>

				<a-col :span="8">
					<label>密码</label>
					<a-input v-model="update.password"/>
					<p>留空则不修改</p>
				</a-col>

				<a-col :span="6" style="float: right">
					<a-button type="primary" @click="store">保存</a-button>
					<a-button @click="show_editor=false">取消</a-button>
				</a-col>

			</a-input-group>
		</div>
		<a-table
				:columns="columns"
				:data-source="users"
				row-key="id"
				:loading="loading"
				:pagination="false"
		>
			<template
					slot="action"
					slot-scope="text, record"
			>
				<a href="javascript:;" @click="edit(record.id, record.name, record.email)">编辑</a>
				<a-divider type="vertical"/>
				<a-popconfirm
						title="你确定要删除?"
						@confirm="rm(record.id)" okText="是的"
						cancelText="再想想">
					<a href="#">删除</a>
				</a-popconfirm>
			</template>
		</a-table>
		<a-pagination
				v-if="last_page > 1"
				:default-current="1"
				:default-page-size="per_page"
				:total="total"
				:current="current_page"
				size="small"
				class="pagination center"
				@change="get_list"
		/>
	</a-card>
</template>

<script>
    const columns = [{
        title: '名称',
        dataIndex: 'name',
        scopedSlots: {customRender: 'name'}
    }, {
        title: '邮箱',
        dataIndex: 'email'
    }, {
        title: '创建日期',
        dataIndex: 'created_at'
    }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: {customRender: 'action'}
    }]
    export default {
        name: "ManageUsers",
        data() {
            return {
                loading: true,
                show_editor: false,
                users: [],
                per_page: 10,
                total: 1,
                last_page: 1,
                current_page: '',
                update: {},
                columns
            }
        },
        beforeMount() {
            this.init()
        },
        methods: {
            init() {
                this.update = {
                    name: ''
                }
                this.show_editor = false
                this.$http.get('/users')
                    .then((response) => {
                        this.users = response.data
                        this.per_page = response.per_page
                        this.total = response.total
                        this.last_page = response.last_page
                        this.current_page = response.current_page
                        this.loading = false
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            get_list(pageNum = 1) {
                this.loading = true
                const t = this
                this.$http.get('/users?page=' + pageNum)
                    .then((response) => {
                        this.users = response.data
                        this.per_page = response.per_page
                        this.total = response.total
                        this.last_page = response.last_page
                        this.current_page = response.current_page
                    })
                    .catch(function (error) {
                        t.$message.error(error.error)
                    });
            },
            create() {
                this.show_editor = true
                this.update = {
                    name: ''
                }
            },
            edit(id, name, email) {
                this.update.id = id
                this.update.name = name
                this.update.email = email
                this.show_editor = true
            },
            store() {
                if (this.update.id) {
                    this.$http.post('/user', this.update)
                        .then(() => {
                            this.$message.success('保存成功')
                            this.init()
                        })
                        .catch((error) => {
                            // eslint-disable-next-line no-console
                            console.log(error)
                        })
                } else {
                    this.$http.put('/user', this.update)
                        .then(() => {
                            this.$message.success('添加成功')
                            this.init()
                        })
                        .catch((error) => {
                            // eslint-disable-next-line no-console
                            console.log(error)
                        })
                }
            },
            rm(id) {
                const t = this
                this.$http.delete('/user', {data: {id: id}})
                    .then(() => {
                        this.$message.success('删除成功')
                        this.init()
                    })
                    .catch((error) => {
                        t.$message.error('删除失败')
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            }
        }
    }
</script>

<style scoped>
	label {
		padding: 5px;
	}

	.ant-btn {
		margin: 5px;
	}

	.input-area {
		margin: 20px 0;
	}

	.input-area input {
		margin: 0 20px 0 0;
		width: 120px;
	}
</style>
