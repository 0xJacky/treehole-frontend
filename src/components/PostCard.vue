<template>
	<a @click="$emit('show_modal')">
		<a-card
				class="card"
				:bordered="false"
				hoverable>
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
				<span class="category">{{ post.category.name }}</span> ·
				<span class="created-at">{{ moment(post.created_at).fromNow() }}</span>
			</div>
		</a-card>
	</a>
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
	.post-content {
		white-space: pre-wrap;
		margin: 0 0 10px 0;
		line-height: 20px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 7;
	}
	.ant-card-cover {
		overflow: hidden;
		width: 100%;
		height: 120px;
	}
	.ant-card-cover img {
		border-radius: 10px 10px 0 0;
		width: 100%;
		height: 120px;
		object-fit: cover;
	}

</style>
