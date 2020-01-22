const BASE_URL = '/api/spotify/';

module.exports = {
    login,
    getTracks,
    refresh,
    getPlaylists,
    getPlaylistDetail,
    getAlbums,
    getAlbumDetail,
    play,
    getAvailableDevices
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

function getAlbums(user) {
    return fetch(BASE_URL + 'albums/' + user).then(res => res.json());
}

function getAlbumDetail(user, album) {
    return fetch(BASE_URL + 'albums/' + user + '/' + album).then(res => res.json());
}

function play(user, track, device) {
    return fetch(BASE_URL + 'play/' + user + '/' + track + '/' + device).then(res => res.json());
}

function getAvailableDevices(user) {
    return fetch(BASE_URL + 'devices/' + user).then(res => res.json());
}

