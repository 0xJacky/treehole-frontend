// 引入 api 接口
import * as types from './mutation-types'

export default {
    // 用户登录
    [types.USER_LOGIN](state, payload) {
        localStorage.setItem('ACCESS_TOKEN', payload.access_token)
        localStorage.setItem('REFRESH_TOKEN', payload.refresh_token)
        state.is_login = true
        state.access_token = payload.access_token
        state.refresh_token = payload.refresh_token
    },
    // 用户注销
    [types.LOG_OUT](state) {
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN')
        state.is_login = false
        state.access_token = null
        state.refresh_token = null
    },
    // 重载评论
    [types.LOAD_COMMENT](state) {
        state.should_reload_comment = true
    },
    [types.COMMENT_RELOADED](state) {
        state.should_reload_comment = false
    }
}
