<template>
	<div class="editor">
		<a-textarea
				v-model="update.content"
				maxlength="200"
				placeholder="有什么想告诉树洞的"
				:row="2"
				:autosize="{ minRows: 2, maxRows: 3 }"
		/>
		<upload
				:upload-url="upload_url"
				file-url=""
				:crop="true"
				:cropOptions="{
						fixed: false,
						fixedNumber:[2.8,1],
						autoCropWidth: 560,
                        autoCropHeight: 200}"
				:keep-file="false"
				theme="tiny"
				ref="upload"/>
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
					ghost
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
    import Upload from './Upload'

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
                },
                upload_url: ''
            }
        },
        components: {
            Upload
        },
        watch: {
            post_id() {
                this.update.post_id = this.post_id
            },
            parent() {
                this.update.parent = this.parent
            },
            categories() {
                this.update.category_id = this.categories[0].id
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
                return new Promise(resolve => {
                    if (this.$refs.upload.file) {
                        this.$refs.upload.handleUpload().then(() => resolve())
                    } else {
                        resolve()
                    }
                })
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
                                .then((response) => {
                                    if (!this.post_id) {
                                        this.upload_url = '/upload/img?post_id=' + response.data.id
                                            + '&upload_uuid=' + response.data.upload_uuid
                                    } else {
                                        this.upload_url = '/upload/img?comment_id=' + response.data.id
                                            + '&upload_uuid=' + response.data.upload_uuid
                                    }

                                    this.$message.success('发布成功')
                                    const t = this
                                    this.upload().then(() => {
                                        t.$emit('get_list')
                                        t.$emit('ok')
                                        t.loading = false
                                        t.$store.dispatch('reload_comment')
                                        t.init()
                                    })
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
	.editor {
		padding: 10px;
	}

	.editor .select-category {
		padding: 10px 0;
		float: left;
	}

	.editor .store {
		padding: 10px 0;
		float: right;
	}
</style>
