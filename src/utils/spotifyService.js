const BASE_URL = '/api/spotify/';

module.exports = {
    login,
    getTracks,
    refresh,
    getPlaylists,
    getPlaylistDetail,
}

function login(user) {
    return fetch(BASE_URL + 'login/' + user).then(res => {
        console.log(res);
    })
}

function refresh(user) {
    return fetch(BASE_URL + 'refresh/' + user).then(res => res)
}

function getTracks(user) {
    return fetch(BASE_URL + 'tracks/' + user).then(res => res.json())
}

function getPlaylists(user) {
    return fetch(BASE_URL + 'playlists/' + user).then(res => res.json())
}

function getPlaylistDetail(user, playlist) {
    return fetch(BASE_URL + 'playlists/' + user + '/' + playlist).then(res => res.json())
}