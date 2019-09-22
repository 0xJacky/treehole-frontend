<template>
	<div class="post-page">
		<p class="post-content">{{ post.content }}</p>
		<div class="post-img" v-if="post.upload_id">
			<img :src="post.upload.url"/>
		</div>
		<div class="favour center">
        <span class="action">
          <a-tooltip title="踩">
            <a-icon type="dislike" :theme="favour === 0 ? 'filled' : 'outlined'" @click="dislikes(post.id)"
            />
          </a-tooltip>
          <span style="padding-left:3px;cursor: auto">
            {{ post.dislikes }}
          </span>
        </span>
			<span class="action">
          <a-tooltip title="赞">
            <a-icon type="like" :theme="favour === 1 ? 'filled' : 'outlined'" @click="likes(post.id)"
            />
          </a-tooltip>
          <span style="padding-left: 3px;cursor: auto">
            {{ post.likes }}
          </span>
        </span>
		</div>
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
		<p class="comment-label">评论</p>
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
    import CommentBlock from "./CommentBlock"
    import Editor from "./Editor"
    import Vue from 'vue'
    import {VueReCaptcha} from 'vue-recaptcha-v3'
    import VueLocalForage from 'vue-localforage'
    import localforage from 'localforage'
    const uuidv4 = require('uuid/v4');

    Vue.use(VueLocalForage)

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
                },
                favour: ''
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
            },
            favour() {

            }
        },
        beforeMount() {
            this.init()
            this.$setStorageDriver(localforage.LOCALSTORAGE)
        },
        methods: {
            init() {
                const t = this
                this.$http.get('/post?id=' + this.id)
                    .then((response) => {
                        this.post = response
                        this.$store.dispatch('comment_reloaded')
                        this.is_like(response.id)
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
            },
            likes() {
                // eslint-disable-next-line eqeqeq
                if (this.favour != 1) {
                    const t = this
                    this.$http.post('/favour/like', {post_id: this.post.id, o:this.favour === 0 ? uuidv4() : ''})
                        .then((response) => {
                            this.favour = 1
                            this.post.likes = response.likes
                            this.post.dislikes = response.dislikes
                            this.$setItem(this.post.id, '1')
                        })
                        .catch(function (error) {
                            t.$message.error(error.error)
                        });

                }
            },
            dislikes() {
                // eslint-disable-next-line eqeqeq
                if (this.favour != 0) {
                    const t = this
                    this.$http.post('/favour/dislike', {post_id: this.post.id, o:this.favour === 1 ? uuidv4() : ''})
                        .then((response) => {
                            this.favour = 0
                            this.post.dislikes = response.dislikes
                            this.post.likes = response.likes
                            this.$setItem(this.post.id, '0')
                        })
                        .catch(function (error) {
                            t.$message.error(error.error)
                        });

                }
            },
            is_like(id) {
                const t = this
                this.$getItem(id).then(function (value) {
                    if (value != null) {
                        t.favour = Number(value)
                    } else {
                        t.favour = ''
                    }

                }).catch(function (err) {
                    // eslint-disable-next-line no-console
                    console.log(err);
                });
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

	.post-img img {
		width: 50%;
	}

	.favour .action {
		padding: 10px;
	}
	@media (prefers-color-scheme: dark) {
		.post-content {
			color: #fff;
		}

		.comment-label {
			color: #fff;
		}

		.favour .action {
			color: #fff;
		}
	}
</style>
