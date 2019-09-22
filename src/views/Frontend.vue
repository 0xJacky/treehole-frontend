<template>
	<div class="main">
		<header>
			<a-row class="center menu">
				<a-col
						:xs="24"
						:sm="24"
						:md="24"
						:lg="24"
						:xl="19"
						:xxl="16"
						class="limit-max">
        <span class="title">
          <router-link to="/home">
            uSilo
          </router-link>
        </span>
					<a-menu
							v-model="current"
							mode="horizontal"
							class="horizontal_menu"
					>
						<a-menu-item
								key="/home"
								class="home_link"
						>
							<router-link to="/home">
								首页
							</router-link>
						</a-menu-item>
						<a-menu-item key="/about">
							<router-link to="/about">
								关于
							</router-link>
						</a-menu-item>
						<a-menu-item key="/admin/home" v-if="is_login">
							<router-link to="/admin/home">
								管理
							</router-link>
						</a-menu-item>
					</a-menu>
				</a-col>
			</a-row>
		</header>
		<a-row class="container">
			<a-col
					:xs="24"
					:sm="24"
					:md="24"
					:lg="24"
					:xl="19"
					:xxl="16"
					class="limit-max"
			>
				<router-view @init="init"/>
			</a-col>
		</a-row>
		<footer>
			<a-row class="row center">
				<a-col
						:xs="24"
						:sm="24"
						:md="24"
						:lg="24"
						:xl="14"
						:xxl="14"
						class="col limit-max"
				>
					<div>
						This site is protected by reCAPTCHA and the Google
						<a href="https://policies.google.com/privacy">Privacy Policy</a> and
						<a href="https://policies.google.com/terms">Terms of Service</a> apply.
					</div>
					<div>
						<a
								href="https://jackyu.cn/"
								target="_blank"
						>Power by uSilo</a>
					</div>
				</a-col>
			</a-row>
		</footer>
	</div>
</template>

<script>
    export default {
        name: 'Frontend',
        data() {
            const date = new Date()
            return {
                notice: '',
                this_year: date.getFullYear()
            }
        },
        computed: {
            current: {
                get() {
                    return [this.$route.path]
                },
                set(val) {
                    return val
                }
            },
            is_login() {
                return this.$store.getters.is_login
            }
        },
        methods: {
            init(data) {
                this.notice = data.notice
            },
        }
    }
</script>

<style scoped>
	.ant-menu-horizontal {
		border-bottom: unset;
	}

	.ant-modal-mask {
		z-index: 1002;
	}
</style>
