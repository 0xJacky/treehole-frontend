export const state = {
    access_token: '' || localStorage.getItem('ACCESS_TOKEN'),
    refresh_token: '' || localStorage.getItem('REFRESH_TOKEN'),
    is_login: !!localStorage.getItem('ACCESS_TOKEN'),
    should_reload_comment: false
}
