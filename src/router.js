import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            component: () => import('./views/Frontend.vue'),
            redirect: '/home',
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('./views/Home.vue')
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () => import('./views/About.vue')
                },
                {
                    path: '/admin',
                    redirect: '/admin/home',
                    component: () => import('./views/Manage.vue'),
                    meta: {requiresAuth: true},
                    children: [
                        {
                            path: 'home',
                            name: '管理中心',
                            component: () => import('./views/ManageCategory.vue'),
                            meta: {requiresAuth: true},
                        },
                        {
                            path: 'category',
                            name: '管理分类',
                            component: () => import('./views/ManageCategory.vue'),
                            meta: {requiresAuth: true},
                        },
                        {
                            path: 'report',
                            name: '管理举报',
                            component: () => import('./views/ManageReport.vue'),
                            meta: {requiresAuth: true},
                        },
                        {
                            path: 'me',
                            name: '个人设置',
                            component: () => import('./views/ManageMe.vue'),
                            meta: {requiresAuth: true},
                        },
                        {
                            path: 'settings',
                            name: '全局设置',
                            component: () => import('./views/ManageSettings.vue'),
                            meta: {requiresAuth: true},
                        },
                    ]
                },
            ]
        },
        {
            path: '/admin/login',
            name: 'login',
            component: () => import('./views/Login.vue')
        },
        {
            path: '/404',
            name: '404页面',
            component: () => import('./views/NotFound.vue')
        },
        {
            path: '*',
            name: '未找到页面',
            redirect: '/404'
        }
    ]
})

// 对象解构，等于 {name} === to.name
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        // 判断该路由是否需要登录权限
        if (localStorage.getItem('ACCESS_TOKEN')) {
            // 通过获取当前的 token 是否存在
            next()
        } else {
            next({
                path: '/admin/login',
                query: {redirect: to.fullPath}
                // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next()
    }
})

export default router
