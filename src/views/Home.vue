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

		<editor :categories="categories" @get_list="get_list"/>

		<a-menu
				v-model="current"
				mode="horizontal"
				class="categories-menu center"
		>
			<a-menu-item key="0">
				最新
			</a-menu-item>
			<a-menu-item v-for="category in categories" :key="category.id">
				{{ category.name }}
			</a-menu-item>
		</a-menu>

		<a-row>
			<a-col
					v-for="post in posts"
					:key="post.id"
					:xs="24"
					:sm="24"
					:md="12"
					:lg="8"
					:xl="8"
					:xxl="8"
					class="post-card"
			>
				<post-card :post="post" @get_list="get_list" @show_modal="visible=true;post_id=post.id"/>
			</a-col>
		</a-row>

		<a-modal
				title="查看语闲"
				:visible="visible"
				:closable="true"
				:centered="true"
				:footer="null"
				@cancel="visible=false"
		>
			<post-page :id="post_id"></post-page>
		</a-modal>

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
    import Editor from '@/components/Editor.vue'
    import PostCard from "@/components/PostCard"
    import PostPage from "@/components/PostPage"

    export default {
        name: 'home',
        components: {
            PostPage,
            PostCard,
            Editor
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
                current: ['0'],
                visible: false,
                post_id: null,
                notice: ''
            }
        },
        beforeMount() {
            this.init()
        },
        computed: {
            is_login() {
                return this.$store.getters.is_login
            }
        },
        watch: {
            current() {
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
                const t = this
                const category = this.current[0] != 0 ? '&category=' + this.current[0] : ''
                this.$http.get('/post/list?page=' + pageNum + category)
                    .then((response) => {
                        this.handle_response(response)
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
</style>
