// import api from '../api/index'
import * as types from './mutation-types'

export const login = ({commit}, data) => {
    commit(types.USER_LOGIN, {
        access_token: data.access_token,
        refresh_token: data.refresh_token
    })
}

export const logout = ({commit}) => {
    commit(types.LOG_OUT)
}

export const reload_comment = ({commit}) => {
    commit(types.LOAD_COMMENT)
}

export const comment_reloaded = ({commit}) => {
    commit(types.COMMENT_RELOADED)
}

