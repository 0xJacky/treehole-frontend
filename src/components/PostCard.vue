<template>
	<a-card
			class="card"
			:bordered="false"
	>
		<img
				v-if="post.upload_id"
				alt="example"
				:src="post.upload.url"
				slot="cover"
		/>
		<p class="post-content">{{ post.content }}</p>
		<div class="post-info">
			<a-popconfirm
					v-if="is_login"
					title="你确定要删除这条动态?"
					@confirm="remove(post.id)" okText="是的"
					cancelText="再想想">
				<a href="#">删除</a> ·
			</a-popconfirm>
			<span class="category">{{ post.category.name }} · </span>
			<span class="created-at">{{ moment(post.created_at).fromNow() }} · </span>
			<span>
				浏览
				{{ post.visits }}
			</span>
			<span v-if="post.comments>0">
				· 评论
				{{ post.comments }}
			</span>
		</div>
	</a-card>
</template>

<script>
    import moment from 'moment'

    require('moment/locale/zh-cn')
    moment.locale('zh-cn')

    export default {
        name: "PostCard",
        props: {
            post: Object
        },
        data() {
            return {
                moment
            }
        },
        computed: {
            is_login() {
                return this.$store.getters.is_login
            }
        },
        methods: {
            remove(id) {
                this.$http.delete('/post', {data: {id: id}})
                    .then(() => {
                        this.$message.success('删除成功')
                        this.$emit('get_list')
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
	.card {
		cursor: pointer;
	}

	.post-content {
		white-space: pre-wrap;
		margin: 0 0 10px 0;
		line-height: 20px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 8;
	}

	@media (prefers-color-scheme: dark) {
		.post-content {
			color: #fff;
		}
	}

</style>
