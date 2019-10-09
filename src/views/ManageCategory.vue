<template>
	<a-card class="manage-category">
		<h2>分类</h2>
		<a-button @click="create" style="margin: 5px 0">创建分类</a-button>
		<div class="input-area" v-show="show_editor">
			<label>名称</label>
			<a-input v-model="update.name"/>

			<label>优先级</label>
			<a-input v-model="update.order"/>

			<a-button type="primary" @click="store">保存</a-button>
			<a-button @click="show_editor=false">取消</a-button>
		</div>
		<a-table
				:columns="columns"
				:data-source="categories"
				row-key="id"
				:loading="loading"
		>
			<template
					slot="action"
					slot-scope="text, record"
			>
				<a href="javascript:;" @click="edit(record.id, record.name, record.order)">编辑</a>
				<a-divider type="vertical"/>
				<a-popconfirm
						title="你确定要删除?"
						@confirm="rm(record.id)" okText="是的"
						cancelText="再想想">
					<a href="#">删除</a>
				</a-popconfirm>
			</template>
		</a-table>
	</a-card>
</template>

<script>
    const columns = [{
        title: '名称',
        dataIndex: 'name',
        scopedSlots: {customRender: 'name'}
    }, {
        title: '优先级',
        dataIndex: 'order'
    }, {
        title: '创建日期',
        dataIndex: 'created_at'
    }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: {customRender: 'action'}
    }]
    export default {
        name: "ManageCategory",
        data() {
            return {
                loading: true,
                show_editor: false,
                categories: [],
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
                this.$http.get('/categories')
                    .then((response) => {
                        this.categories = response
                        this.loading = false
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            create() {
                this.show_editor = true
                this.update = {
                    name: ''
                }
            },
            edit(id, name, order) {
                this.update.id = id
                this.update.name = name
                this.update.order = order
                this.show_editor = true
            },
            store() {
                this.$http.post('/category', this.update)
                    .then(() => {
                        this.$message.success('保存成功')
                        this.init()
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            rm(id) {
                const t = this
                this.$http.delete('/category', {data: {id: id}})
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
