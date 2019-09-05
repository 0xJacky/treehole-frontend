<template>
	<div class="post-page">
		<p class="post-content">{{ post.content }}</p>
		<div class="post-info">
			<a-popconfirm
					v-if="is_login"
					title="你确定要删除这条动态?"
					@confirm="remove(post.id)" okText="是的"
					cancelText="再想想">
				<a href="#">删除</a> ·
			</a-popconfirm>
			<a-popconfirm
					title="你确定要举报这条动态?"
					@confirm="report(post.id)" okText="是的"
					cancelText="再想想">
				<span class="report">举报</span> ·
			</a-popconfirm>
			<span class="category">{{ post.category.name }}</span> ·
			<span class="created-at">{{ moment(post.created_at).fromNow() }}</span>
		</div>
		<a-divider/>
		<p>评论</p>
		<editor :post_id="post.id"/>
		<comment-block
				v-for="root in post.comments.root"
				:key="root.id"
				:comment="root"
				:comments="post.comments.children"/>
	</div>
</template>

<script>
    import moment from 'moment'
    import CommentBlock from "./CommentBlock";
    import Editor from "./Editor";
    import Vue from 'vue'
    import {VueReCaptcha} from 'vue-recaptcha-v3'

    Vue.use(VueReCaptcha, {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        loaderOptions: {
            useRecaptchaNet: true
        }
    })

    require('moment/locale/zh-cn')
    moment.locale('zh-cn')

    export default {
        name: "PostPage",
        components: {Editor, CommentBlock},
        props: {
            id: String
        },
        data() {
            return {
                moment,
                post: {
                    comments: {},
                    category: {}
                }
            }
        },
        computed: {
            should_reload_comment() {
                return this.$store.getters.should_reload_comment
            },
            is_login() {
                return this.$store.getters.is_login
            }
        },
        watch: {
            id() {
                this.init()
            },
            should_reload_comment() {
                if (this.should_reload_comment) {
                    this.init()
                }
            }
        },
        beforeMount() {
            this.init()
        },
        methods: {
            init() {
                const t = this
                this.$http.get('/post?id=' + this.id)
                    .then((response) => {
                        this.post = response
                        this.$store.dispatch('comment_reloaded')
                    })
                    .catch(function (error) {
                        t.$message.error(error.error)
                    });
            },
            report(id) {
                this.$recaptchaLoaded().then(() => {
                    this.$recaptcha('/report').then((token) => {
                        const t = this
                        this.$http.post('/report', {post_id: id, token: token})
                            .then(() => {
                                this.$message.success('举报成功')
                            })
                            .catch(function (error) {
                                t.$message.error(error.error)
                            });
                    });
                });
            },
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
	}
</style>
