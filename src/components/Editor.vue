<template>
	<div class="editor">
		<a-textarea
				v-model="update.content"
				maxlength="200"
				placeholder="有什么想告诉树洞的"
				:row="2"
				:autosize="{ minRows: 2, maxRows: 3 }"
		/>
		<div class="select-category" v-if="Object(categories).length>0">
			<a-select v-model="update.category_id" style="width: 120px">
				<a-select-option v-for="category in categories" :key="category.id" :value="category.id">
					{{ category.name }}
				</a-select-option>
			</a-select>
		</div>
		<div class="store">
			<a-button
					:loading="loading"
					type="primary"
					@click="store()"
			>
				发布
			</a-button>
		</div>
		<div class="clear"/>
	</div>
</template>

<script>
    import Vue from 'vue'
    import {VueReCaptcha} from 'vue-recaptcha-v3'

    Vue.use(VueReCaptcha, {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        loaderOptions: {
            useRecaptchaNet: true
        }
    })

    export default {
        name: 'Editor',
        props: {
            categories: {
                type: Array,
                default: null
            },
            post_id: {
                type: String,
                default: null
            },
            parent: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                loading: false,
                update: {
                    category_id: '',
                    content: '',
                    img: ''
                }
            }
        },
        watch: {
            post_id() {
                this.update.post_id = this.post_id
            },
            parent() {
                this.update.parent = this.parent
            }
        },
        beforeMount() {
            this.init()
        },
        methods: {
            init() {
                this.update.content = ''
                if (this.categories) {
                    this.update.category_id = ''
                }
                if (this.post_id) {
                    this.update.post_id = this.post_id
                }
                if (this.parent) {
                    this.update.parent = this.parent
                }
            },
            upload() {

            },
            store() {
                // eslint-disable-next-line eqeqeq
                if (this.update.content == '') {
                    this.$message.error('内容不能为空')
                } else {
                    this.loading = true
                    const url = !this.post_id ? '/post' : '/comment'
                    this.$recaptchaLoaded().then(() => {
                        this.$recaptcha(url).then((token) => {
                            this.update.token = token
                            this.$http.post(url, this.update)
                                .then(() => {
                                    this.$message.success('发布成功')
                                    this.$emit('get_list')
                                    this.$emit('ok')
                                    this.loading = false
                                    this.$store.dispatch('reload_comment')
                                    this.init()
                                })
                                .catch((error) => {
                                    this.$message.error('发布失败 ' + error.data.message)
                                    // eslint-disable-next-line no-console
                                    console.log(error)
                                });
                        })
                    })
                }
            }
        }
    }
</script>

<style scoped>
	.editor .select-category {
		padding: 10px 0;
		float: left;
	}

	.editor .store {
		padding: 10px 0;
		float: right;
	}
</style>
