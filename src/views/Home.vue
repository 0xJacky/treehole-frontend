<template>
	<div class="home">
		<div class="project-title">
			<h1>语闲</h1>
			<p>Write your story</p>
		</div>

		<a-alert
				v-if="notice"
				message="公告"
				:description="notice"
				type="info"
				showIcon
				closeText="关闭"
		/>

		<a-menu
				v-model="current"
				mode="horizontal"
				class="categories-menu center"
		>
			<a-menu-item key="0">
				<router-link to="/home">
					最新
				</router-link>
			</a-menu-item>

			<a-menu-item v-for="category in categories" :key="category.id">
				<router-link :to="'/category/'+category.id">
					{{ category.name }}
				</router-link>
			</a-menu-item>
		</a-menu>

		<a-timeline mode="alternate">
			<a-timeline-item
					style="width: 89%; margin: 0 auto"
					v-for="post in posts"
					:key="post.id">
				<router-link :to="'/post/'+post.id" class="no_hover">
					<post-card :post="post" @get_list="get_list"/>
				</router-link>
			</a-timeline-item>
		</a-timeline>

		<a-spin v-show="loading" class="center">
			<a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
		</a-spin>

		<p v-if="posts.length==0 && !loading" class="center">空空如也</p>

		<a-pagination
				v-if="last_page > 1"
				:default-current="1"
				:default-page-size="per_page"
				:total="total"
				:current="current_page"
				size="small"
				class="pagination center"
				@change="get_list"
		/>
	</div>
</template>

<script>
    // @ is an alias to /src
    import PostCard from "@/components/PostCard"

    export default {
        name: 'home',
        components: {
            PostCard
        },
        data() {
            return {
                loading: true,
                categories: [],
                posts: [],
                per_page: 10,
                total: 1,
                last_page: 1,
                current_page: '',
                current: [this.$route.params.category_id ? this.$route.params.category_id : '0'],
                post_id: null,
                notice: ''
            }
        },
        beforeMount() {
            if (this.$route.params.category_id) {
                this.get_list()
            } else {
                this.init()
            }
        },
        computed: {
            is_login() {
                return this.$store.getters.is_login
            }
        },
        watch: {
            '$route'() {
                this.get_list()
            }
        },
        methods: {
            handle_response(response) {
                this.per_page = response.per_page
                this.total = response.total
                this.last_page = response.last_page
                this.current_page = response.current_page
                this.posts = response.data
                this.loading = false
            },
            get_list(pageNum = 1) {
                this.loading = true
                const t = this
                const category = this.$route.params.category_id ? '&category=' + this.$route.params.category_id : ''
                const init = this.categories.length == 0 ? '&init=true' : ''
                this.$http.get('/post/list?page=' + pageNum + category + init)
                    .then((response) => {
                        this.handle_response(response.posts)
                        this.loading = false
                        if (this.categories.length == 0) {
                            this.categories = response.categories
                            this.notice = response.notice
                        }
                    })
                    .catch(function (error) {
                        t.$message.error(error.error)
                    });
            },
            init() {
                this.$http.get('/frontend/home')
                    .then((response) => {
                        this.categories = response.categories
                        this.notice = response.notice
                        this.handle_response(response.posts)
                        this.loading = false
                    })
                    .catch(function (error) {
                        this.$message.error(error.error)
                    });
            }
        }
    }
</script>

<style scoped>
	.ant-alert.ant-alert-closable {
		margin: 10px;
	}

	.no_hover:hover {
		color: unset;
	}

	.ant-timeline-item-right .card {
		margin: 0 0 10px 20px;
	}

	.ant-timeline-item-left .card {
		margin: 0 20px 10px 0;
	}
</style>
