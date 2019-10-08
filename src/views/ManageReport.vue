<template>
	<a-card>
		<h2>管理举报</h2>
		<a-button type="link" @click="status = 0">未处理</a-button>
		<a-button type="link" @click="status = 1">已处理</a-button>
		<a-table
				:columns="columns"
				:data-source="reports"
				:row-key="'id'"
				:pagination="false"
		>
			<template
					slot="id"
					slot-scope="text"
			>
				{{ text }}
			</template>
			<template
					slot="content"
					slot-scope="text, record"
			>
				{{ record.post_id ? '动态: '+ (record.post.content.length > 25 ? record.post.content.substring(0,24)+'...'
				:
				record.post.content) : '评论: '+(record.comment.content.length > 25 ?
				record.comment.content.substring(0,24)+'...' : record.comment.content) }}
			</template>
			<template
					slot="created_at"
					slot-scope="text"
			>
				{{ moment(text).fromNow() }}
			</template>
			<span slot="action" slot-scope="text, record">
          <a href="javascript:;" v-if="record.post_id" @click="show(record.post.id)">查看</a>
				<a href="javascript:;" v-else @click="show(record.comment.post_id)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:;" @click="dispose(record.id)" v-if="record.status==0">标记为已处理</a>
          <a href="javascript:;" @click="withdraw(record.id)" v-else>标记为未处理</a>
        </span>
		</a-table>
		<a-modal
				title="查看语闲"
				:visible="visible"
				:closable="true"
				:centered="true"
				:footer="null"
				@cancel="visible=false"
		>
			<post-page :id="post_id"></post-page>
		</a-modal>
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
    import moment from 'moment'
    import PostPage from "../components/PostPage";

    require('moment/locale/zh-cn')
    moment.locale('zh-cn')
    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        scopedSlots: {customRender: 'id'}
    }, {
        title: '内容',
        dataIndex: 'content',
        scopedSlots: {customRender: 'content'}
    }, {
        title: '创建时间',
        dataIndex: 'created_at',
        scopedSlots: {customRender: 'created_at'}
    }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: {customRender: 'action'}
    }]
    export default {
        name: "Report",
        components: {PostPage},
        data() {
            return {
                columns,
                moment,
                reports: [],
                visible: false,
                post_id: '',
                per_page: 10,
                total: 1,
                last_page: 1,
                current_page: '',
                status: 0
            }
        },
        beforeMount() {
            this.get_list()
        },
        watch: {
            status() {
                this.get_list()
            }
        },
        methods: {
            get_list(pageNum = 1) {
                this.$http.get('/report/list?page=' + pageNum + '&status=' + this.status)
                    .then((response) => {
                        this.per_page = response.per_page
                        this.total = response.total
                        this.last_page = response.last_page
                        this.current_page = response.current_page
                        this.reports = response.data
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            show(post_id) {
                this.visible = true;
                this.post_id = post_id
            },
            dispose(id) {
                this.$http.post('/report/dispose', {id: id})
                    .then(() => {
                        this.$message.success('更新完成')
                        this.get_list()
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            withdraw(id) {
                this.$http.post('/report/withdraw', {id: id})
                    .then(() => {
                        this.$message.success('更新完成')
                        this.get_list()
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
        }
    }
</script>

<style scoped>

</style>
