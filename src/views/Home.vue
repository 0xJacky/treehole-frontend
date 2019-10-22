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
			<a-menu-item key="0" @click="get_list">
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
					<post-card :post="post" @get_list="get_list(1)"/>
				</router-link>
			</a-timeline-item>
		</a-timeline>

		<a-spin v-show="loading" class="center">
			<a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
		</a-spin>

		<p v-if="posts.length==0 && !loading" class="center auto-dark">空空如也</p>
		<p v-if="posts.length!==0 && noMore" class="center auto-dark">人家也是有底线的</p>
	</div>
</template>

<script>
    // @ is an alias to /src
    import PostCard from "@/components/PostCard"

    export default {
        name: 'Home',
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
                notice: '',
                noMore: false
            }
        },
        created() {
            if (this.$route.params.category_id) {
                this.get_list()
            } else {
                this.init()
            }
        },
        activated() {
            this.scroll()
        },
        computed: {
            is_login() {
                return this.$store.getters.is_login
            }
        },
        watch: {
            '$route'() {
                if (this.$route.fullPath.search('category') !== -1 || this.$route.fullPath.search('from') !== -1) {
                    this.get_list()
                }
            }
        },
        methods: {
            handle_response(response) {
                if (response.current_page === response.last_page) {
                    this.noMore = true
                }
                if (response.current_page < response.last_page) {
                    this.noMore = false
                }
                if (response.current_page === 1) {
                    this.posts = response.data
                } else {
                    this.posts.push.apply(this.posts, response.data)
                }
                this.per_page = response.per_page
                this.total = response.total
                this.last_page = response.last_page
                this.current_page = response.current_page
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
                const t = this;
                this.$http.get('/frontend/home')
                    .then((response) => {
                        this.categories = response.categories
                        this.notice = response.notice
                        this.handle_response(response.posts)
                        this.loading = false
                    })
                    .catch(function (error) {
                        t.$message.error(error)
                    });
            },
            scroll() {
                window.onscroll = () => {
                    // scrollTop 是滚动条滚动时，距离顶部的距离
                    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    // windowHeight 是可视区的高度
                    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    // scrollHeight 是滚动条的总高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    // 滚动条到底部的条件
                    if (scrollTop + windowHeight >= scrollHeight && !this.noMore) {
                        this.current_page = this.current_page + 1
                        this.loading = true
                        const t = this
                        this.$nextTick(() => {
                            t.get_list(t.current_page)
                            t.loading = false
                        })

                    }
                }
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

	.ant-timeline-item {
		padding: 0;
	}

	.ant-timeline-item-right .card {
		margin: 0 0 10px 20px;
	}

	.ant-timeline-item-left .card {
		margin: 0 20px 10px 0;
	}
</style>
