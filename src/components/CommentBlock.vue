<template>
	<div>
		<a-comment>
			<p slot="content">{{ comment.content }}</p>
			<div slot="content" class="post-img" v-if="comment.upload_id">
				<img :src="comment.upload.url"/>
			</div>
			<span slot="datetime">{{moment(comment.created_at).fromNow()}}</span>
			<span slot="actions">
          <a-tooltip title="踩">
            <a-icon type="dislike" :theme="comment.favour == 0 ? 'filled' : 'outlined'" @click="dislikes(comment.id)"
            />
          </a-tooltip>
          <span style="padding-left:3px;cursor: auto">
            {{ comment.dislikes }}
          </span>
        </span>
			<span slot="actions">
          <a-tooltip title="赞">
            <a-icon type="like" :theme="comment.favour == 1 ? 'filled' : 'outlined'" @click="likes(comment.id)"
            />
          </a-tooltip>
          <span style="padding-left: 3px;cursor: auto">
            {{ comment.likes }}
          </span>
            </span>
			<span slot="actions" @click="reply=true">回复</span>
			<a-popconfirm
					slot="actions"
					v-if="is_login"
					title="你确定要删除这条动态?"
					@confirm="remove(comment.id)" okText="是的"
					cancelText="再想想">
				<span href="#">删除</span>
			</a-popconfirm>
			<a-popconfirm
					slot="actions"
					title="你确定要举报这条动态?"
					@confirm="report(comment.id)" okText="是的"
					cancelText="再想想">
				<span href="#">举报</span>
			</a-popconfirm>
			<editor v-if="reply" :post_id="comment.post_id" :parent="comment.id" @ok="reply=false"/>
			<comment-block v-for="child in comments[comment.id]" :key="child.id" :comment="child" :comments="comments"/>
		</a-comment>
	</div>
</template>

<script>
    import Editor from "./Editor"
    import moment from 'moment'

    require('moment/locale/zh-cn')
    moment.locale('zh-cn')

    export default {
        name: "CommentBlock",
        components: {Editor},
        props: {
            comments: [Object, Array],
            comment: [Object, Array]
        },
        data() {
            return {
                reply: false,
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
                this.$http.delete('/comment', {data: {id: id}})
                    .then(() => {
                        this.$message.success('删除成功')
                        this.$store.dispatch('reload_comment')
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            },
            report(id) {
                const t = this
                this.$http.post('/report', {comment_id: id})
                    .then(() => {
                        this.$message.success('举报成功')
                    })
                    .catch(function (error) {
                        t.$message.error(error.error)
                    });
            },
            likes() {
                // eslint-disable-next-line eqeqeq
                if (this.comment.favour != 1) {
                    const t = this
                    this.$http.post('/favour/like', {comment_id: this.comment.id})
                        .then((response) => {
                            this.comment.favour = 1
                            this.comment.likes = response.likes
                        })
                        .catch(function (error) {
                            t.$message.error(error.error)
                        });

                }
            },
            dislikes() {
                // eslint-disable-next-line eqeqeq
                if (this.comment.favour != 0) {
                    const t = this
                    this.$http.post('/favour/dislike', {comment_id: this.comment.id})
                        .then((response) => {
                            this.comment.favour = 0
                            this.comment.dislikes = response.dislikes
                        })
                        .catch(function (error) {
                            t.$message.error(error.error)
                        });

                }
            }
        }
    }
</script>

<style scoped>
	.post-img img {
		width: 50%;
	}
</style>
