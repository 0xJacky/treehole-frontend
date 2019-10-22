<template>
	<a-row class="manage-container">
		<a-col
				class="sidebar"
				:xs="3"
				:sm="4"
				:md="4"
				:lg="6"
				:xl="5"
				:xxl="4"
		>
			<div class="avatar">
				<div class="info">
					<h1>uSilo</h1>
					<p>语闲管理系统</p>
				</div>
			</div>
			<a-menu
					mode="inline"
					v-model="current"
					:inlineCollapsed="collapsed"
			>
				<template>
					<a-menu-item key="/admin/category" @click="$router.push('/admin/category')">
						<a-icon type="folder"/>
						<span>
						分类
						</span>
					</a-menu-item>
				</template>


				<template>
					<a-menu-item key="/admin/report" @click="$router.push('/admin/report')">
						<a-icon type="exclamation-circle" />
						<span>
							举报
						</span>
					</a-menu-item>
				</template>

				<template>
					<a-menu-item key="/admin/users" @click="$router.push('/admin/users')">
						<a-icon type="team"/>
						<span>
							管理用户
						</span>
					</a-menu-item>
				</template>

				<template>
					<a-menu-item key="/admin/me" @click="$router.push('/admin/me')">
						<a-icon type="user"/>
						<span>
							个人设置
						</span>
					</a-menu-item>
				</template>

				<template>
					<a-menu-item key="/admin/settings" @click="$router.push('/admin/settings')">
						<a-icon type="setting"/>
						<span>
							全局设置
						</span>
					</a-menu-item>
				</template>

			</a-menu>
		</a-col>
		<a-col
				class="content"
				:xs="19"
				:sm="20"
				:md="20"
				:lg="18"
				:xl="19"
				:xxl="20">
			<header>
				<div class="menu">
					<span class="login_button"><a-button type="link" @click="logout">注销</a-button></span>
					<span class="login_button"><a href="/"><a-button type="link">首页</a-button></a></span>
				</div>
			</header>
			<div class="view">
				<vue-particles
						color="#dedede"
						:particlesNumber="60"
						:move-speed="3"
						:click-effect="false"
						:hover-effect="false"
						class="particles"/>
				<router-view></router-view>
			</div>
			<footer>
				<div>
					© uSilo 2019
				</div>
				<div>
					<a
							href="https://jackyu.cn/"
							target="_blank"
					>Designed by OxJacky</a>
				</div>
			</footer>
		</a-col>
		<a-back-top/>
	</a-row>
</template>

<script>
    import Vue from 'vue'
    import VueParticles from 'vue-particles'

    Vue.use(VueParticles)

    export default {
        name: "Manage",
        data() {
            return {
                current: [this.$route.path],
                collapsed: document.body.clientWidth > 768 ? false : true
            }
        },
        watch: {
            'route'() {
                this.current = [this.$route.path]
            }
        },
        mounted() {
            this.collapsed = document.body.clientWidth > 768 ? false : true
            const _this = this;
            window.onresize = function temp() {
                _this.collapsed = document.body.clientWidth > 768 ? false : true
            };
        },
        methods: {
            logout() {
                const t = this
                this.$http.delete('/authorizations/current')
                    .then(() => {
                        this.$store.dispatch('logout')
                        this.$message.success('注销成功')
                        this.$router.push('/home')
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error)
                        t.$store.dispatch('logout')
                        t.$router.push('/home')
                    })
            },
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.openKeys = openKeys
                } else {
                    this.openKeys = latestOpenKey ? [latestOpenKey] : []
                }
            },
        }
    }
</script>

<style scoped>
	@import "../assets/css/manage.css";

	.particles {
		position: fixed;
		z-index: -1;
		left: 0;
		width: 100%;
		height: 100%;
	}

	header {
		height: 50px;
		position: relative;
		box-shadow: unset;
		-webkit-box-shadow: unset;
		border-bottom: 1px solid #e9e9e9;
	}

	header .avatar, header .login_button {
		float: right;
		line-height: 50px;
		padding: 0 10px 0 0;
	}

	footer {
		float: right;
		margin: 30px 15px 15px 15px;
	}
</style>
