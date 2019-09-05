<template>
	<div>
		<a-row
				class="login center"
				:align="'middle'"
				:type="'flex'"
		>
			<a-col
					:xs="24"
					:sm="12"
					:md="9"
					:lg="8"
					:xl="6"
					:xxl="5"
					class="login-panel center"
			>
				<a-form
						id="components-form-demo-normal-login"
						:form="form"
						class="login-form"
						@submit="handleSubmit"
				>
					<div class="welcome">
						<h1>管理系统</h1>
					</div>
					<a-form-item>
						<label>邮箱</label>
						<a-input
								v-decorator="['username',{ rules: [{type: 'email', message: '您输入的邮箱地址无效'},{ required: true, message: '请输入邮箱!' }] }]"
								placeholder="请输入"
								autocomplete="on"
						>
							<a-icon
									slot="prefix"
									type="user"
									style="color: rgba(0,0,0,.25)"
							/>
						</a-input>
					</a-form-item>
					<a-form-item>
						<label>密码</label>
						<a-input
								v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]"
								type="password"
								placeholder="请输入"
								autocomplete="on"
						>
							<a-icon
									slot="prefix"
									type="lock"
									style="color: rgba(0,0,0,.25)"
							/>
						</a-input>
					</a-form-item>
					<a-form-item>
						<div class="checkbox">
							<a-checkbox
									v-decorator="['remember',{valuePropName: 'checked',initialValue: true}]"
									class="remember"
							>
								记住密码
							</a-checkbox>
							<div class="clear"/>
						</div>
						<div class="login-form-button center">
							<a>
								<a-button
										:loading="login_loading"
										html-type="submit"
										style="margin: 0 10px 0 0"
										type="primary"
								>
									登录
								</a-button>
							</a>
						</div>
					</a-form-item>
				</a-form>
			</a-col>
		</a-row>
		<loading :loading="loading"/>
	</div>
</template>

<script>
    import Loading from '@/components/Loading'

    import Vue from 'vue'
    import {VueReCaptcha} from 'vue-recaptcha-v3'

    Vue.use(VueReCaptcha, {
        siteKey: process.env.VUE_APP_RECAPTCHA_SITEKEY,
        loaderOptions: {
            useRecaptchaNet: true
        }
    })
    export default {
        name: 'Login',
        components: {
            Loading
        },
        data() {
            return {
                loading: true,
                login_loading: false
            }
        },
        beforeMount() {
            this.form = this.$form.createForm(this)
            if (this.$store.getters.is_login) {
                this.$router.push('/admin/home')
            } else {
                this.loading = false
            }
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault()
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.login_loading = true
                        this.$recaptchaLoaded().then(() => {
                            this.$recaptcha('/admin/login').then((token) => {
                                values.token = token
                                values.grant_type = 'password'
                                values.client_id = process.env.VUE_APP_CLIENT_ID
                                values.client_secret = process.env.VUE_APP_CLIENT_SECRET
                                this.$http.post('/authorizations', values)
                                    .then((response) => {
                                        let expireDays = 1000 * 60 * 60 * 24 * 15
                                        const data = {
                                            access_token: response.data.access_token,
                                            refresh_token: response.data.refresh_token
                                        }
                                        this.$store.dispatch('login', data, expireDays)
                                        // 登录成功后
                                        const path = this.$route.query.redirect ? this.$route.query.redirect : '/admin/home'
                                        this.$router.push(path)
                                    })
                                    .catch((error) => {
                                        this.login_loading = false
                                        if (error.error) {
                                            this.$message.error(error.error)
                                        }
                                    });
                            })
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
