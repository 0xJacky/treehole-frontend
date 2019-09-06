<template>
	<div>
		<a-upload
				list-type="picture-card"
				class="avatar-uploader"
				:show-upload-list="false"
				:before-upload="beforeUpload"
				:withCredentials="true"
				v-if="theme === 'normal'"
		>
			<div v-if="preview==='img'">
				<img :src="file" v-if="file" width="64">
			</div>
			<div v-else>
				<p v-if="preview==='list'">{{file}}</p>
			</div>
			<div v-if="!file">
				<a-icon :type="uploading ? 'loading' : 'plus'"/>
				<div class="ant-upload-text">
					上传文件
				</div>
			</div>
		</a-upload>

		<a-upload
				:show-upload-list="false"
				:before-upload="beforeUpload"
				:withCredentials="true"
				v-if="theme === 'tiny'"
		>
			<a-popover
					trigger="click"
					placement="bottom"
					:visible="!!file"
			>
				<img slot="content" :src="file" width="64"/>
				<span class="upload-picture-btn">
        <a-icon type="picture"/>
      </span>
			</a-popover>
		</a-upload>
		<a-modal
				title="图片裁切"
				v-model="visible"
				@ok="handleCropSuccess"
				@cancel="visible=false"
				v-if="crop"
				okText="裁切"
				cancelText="不裁切"
		>
			<a-button @click="withdraw">放弃所有更改</a-button>
			<div class="vue-cropper">
				<VueCropper
						ref="cropper"
						:img="file"
						outputType="png"
						:autoCrop="true"
						:fixed="cropOptions.fixed"
                        :fixedNumber="cropOptions.fixedNumber"
						:autoCropWidth="cropOptions.autoCropWidth"
						:autoCropHeight="cropOptions.autoCropHeight"
				/>
			</div>
		</a-modal>
	</div>
</template>

<script>
    import Vue from 'vue'
    import reqwest from 'reqwest'
    import {VueReCaptcha} from 'vue-recaptcha-v3'
    import {VueCropper} from 'vue-cropper'

    const uuidv1 = require('uuid/v1');

    Vue.use(VueReCaptcha, {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        loaderOptions: {
            useRecaptchaNet: true
        }
    })

    const api = process.env.VUE_APP_API_ROOT

    export default {
        name: "Upload",
        components: {
            VueCropper,
        },
        props: {
            uploadUrl: String,
            fileUrl: {
                type: String,
                default: null
            },
            preview: {
                default: 'img',
                validator: function (value) {
                    return ['img', 'list'].indexOf(value) !== -1
                }
            },
            keepFile: {
                type: Boolean,
                default: true
            },
            theme: {
                type: String,
                default: 'normal',
                validator: function (value) {
                    return ['tiny', 'normal'].indexOf(value) !== -1
                }
            },
            crop: {
                type: Boolean,
                default: false
            },
            cropOptions: {
                type: Object,
                default: function () {
                    return {
                        fixed: true,
                        autoCropWidth: 128,
                        autoCropHeight: 128,
                    };
                }
            },
        },
        data() {
            return {
                api,
                uploading: false,
                file: '',
                orig: '',
                upload: '',
                visible: false
            }
        },
        beforeMount() {
            this.upload = this.uploadUrl
            this.file = this.fileUrl
            this.origFile = this.fileUrl
        },
        watch: {
            uploadUrl() {
                this.upload = this.uploadUrl
            },
            fileUrl() {
                this.file = this.fileUrl
            },
            origFile() {
                this.origFile = this.fileUrl
            }
        },
        methods: {
            handleUpload() {
                return new Promise(resolve => {
                    const {fileList} = this;
                    const formData = new FormData();
                    fileList.forEach((file) => {
                        formData.append('img', file);
                    });
                    this.uploading = true
                    this.$message.info('正在上传附件, 请不要关闭本页')

                    this.$recaptchaLoaded().then(() => {
                        this.$recaptcha('/upload/img').then((token) => {
                            reqwest({
                                url: api + this.upload + '&token=' + token,
                                method: 'post',
                                processData: false,
                                crossOrigin: true,
                                data: formData,
                                success: (data) => {
                                    this.fileList = []
                                    this.uploading = false
                                    this.$message.success('文件上传成功');
                                    if (this.keepFile) {
                                        this.file = data.url
                                    } else {
                                        this.file = ''
                                    }
                                    resolve()
                                },
                                error: (data) => {
                                    const response = JSON.parse(data.response)
                                    this.uploading = false
                                    const error = response.error ? response.error : '未知错误'
                                    this.$message.error('文件上传失败: ' + error);
                                },
                            });
                        })
                    })
                })
            },
            beforeUpload(file) {
                this.fileList = [file]
                if (this.preview === 'img') {
                    this.visible = true
                    const r = new FileReader();
                    r.readAsDataURL(file);
                    r.onload = e => {
                        file.thumbUrl = e.target.result
                        this.file = e.target.result
                        this.orig = e.target.result
                    };
                } else {
                    this.file = file
                }
                return false;
            },
            afterCropUpload(file) {
                this.fileList = [file]
                this.visible = true
                const r = new FileReader();
                r.readAsDataURL(file);
                r.onload = e => {
                    file.thumbUrl = e.target.result
                    this.file = e.target.result
                };
            },
            withdraw() {
                this.file = this.orig
            },
            handleCropSuccess() {
                this.$refs.cropper.getCropBlob((data) => {
                    let file = new window.File([data], uuidv1() + '.png', {type: data.type})
                    this.afterCropUpload(file)
                    this.visible = false
                })
            }
        }
    }
</script>

<style scoped>
	.upload-picture-btn {
		font-size: 20px;
		color: #1890ff;
	}

	.vue-cropper {
		min-height: 512px;
		background-image: unset;
	}

</style>
