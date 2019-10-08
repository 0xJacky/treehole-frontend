<template>
	<div class="favour center">
        <span class="action">
          <a-tooltip title="踩">
            <a-icon type="dislike" :theme="favour === 0 ? 'filled' : 'outlined'" @click="dislikes(post.id)"
            />
          </a-tooltip>
          <span style="padding-left:3px">
            {{ post.dislikes }}
          </span>
        </span>
		<span class="action">
          <a-tooltip title="赞">
            <a-icon type="like" :theme="favour === 1 ? 'filled' : 'outlined'" @click="likes(post.id)"
            />
          </a-tooltip>
          <span style="padding-left: 3px">
            {{ post.likes }}
          </span>
        </span>
	</div>
</template>

<script>
    import Vue from 'vue'
    import {VueReCaptcha} from 'vue-recaptcha-v3'
    import VueLocalForage from 'vue-localforage'
    import localforage from 'localforage'

    Vue.use(VueLocalForage)
    Vue.use(VueReCaptcha, {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        loaderOptions: {
            useRecaptchaNet: true
        }
    })

    export default {
        name: "Favour",
        props: {
            likes_Number: Number,
            dislikes_Number: Number,
            id: String,
            type: {
                validator: function (value) {
                    return ['post', 'comment'].indexOf(value) !== -1
                }
            }
        },
        data() {
            return {
                post: {
                    id: this.id,
                    likes: this.likes_Number,
                    dislikes: this.dislikes_Number
                },
                favour: '',
                rollback: false,
                lock: false
            }
        },
        mounted() {
            this.$setStorageDriver(localforage.LOCALSTORAGE)
            this.is_like(this.id)
        },
        watch: {
            id() {
                this.post.id = this.id
                this.post.likes = this.likes_Number
                this.post.dislikes = this.dislikes_Number
                this.is_like(this.id)
            }
        },
        methods: {
            likes() {
                // eslint-disable-next-line eqeqeq
                if (this.favour != 1 && !this.lock) {
                    this.lock = true
                    const t = this
                    this.favour = 1
                    this.post.likes++
                    this.$getItem(this.post.id).then(function (value) {
                        if (value != null && Number(value) === 0) {
                            t.rollback = true
                        } else {
                            t.rollback = false
                        }

                    }).catch(function (err) {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    });
                    this.$recaptchaLoaded().then(() => {
                        this.$recaptcha('/favour/like').then((token) => {
                            let update = {
                                rollback: this.rollback,
                                token: token
                            }
                            update[this.type === 'post' ? 'post_id' : 'comment_id'] = this.post.id
                            this.$http.post('/favour/like', update)
                                .then((response) => {
                                    this.post.likes = response.likes
                                    this.post.dislikes = response.dislikes
                                    this.$setItem(this.post.id, '1')
                                    if (this.rollback) {
                                        this.$message.success('点赞数据同步成功')
                                    }
                                    this.rollback = false
                                    this.lock = false
                                })
                                .catch(function (error) {
                                    t.$message.error(error.error)
                                    t.favour = ''
                                    t.lock = false
                                });
                        })
                    })
                }
            },
            dislikes() {
                // eslint-disable-next-line eqeqeq
                if (this.favour != 0 && !this.lock) {
                    this.lock = true
                    const t = this
                    this.favour = 0
                    this.post.dislikes++
                    this.$getItem(this.post.id).then(function (value) {
                        if (value != null && Number(value) === 1) {
                            t.rollback = true
                        } else {
                            t.rollback = false
                        }

                    }).catch(function (err) {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    });
                    this.$recaptchaLoaded().then(() => {
                        this.$recaptcha('/favour/dislike').then((token) => {
                            let update = {
                                rollback: this.rollback,
                                token: token
                            }
                            update[this.type === 'post' ? 'post_id' : 'comment_id'] = this.post.id
                            this.$http.post('/favour/dislike', update)
                                .then((response) => {
                                    this.post.dislikes = response.dislikes
                                    this.post.likes = response.likes
                                    this.$setItem(this.post.id, '0')
                                    if (this.rollback) {
                                        this.$message.success('点赞数据同步成功')
                                    }
                                    this.rollback = false
                                    this.lock = false
                                })
                                .catch(function (error) {
                                    t.$message.error(error.error)
                                    t.favour = ''
                                    t.lock = false
                                });
                        })
                    })

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
	.favour .action {
		padding: 10px;
		cursor: pointer
	}

	@media (prefers-color-scheme: dark) {
		.favour .action {
			color: #fff;
		}
	}


</style>
