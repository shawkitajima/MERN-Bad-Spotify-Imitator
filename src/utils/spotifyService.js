const BASE_URL = '/api/spotify/';
const axios = require('axios');

module.exports = {
    login,
    getTracks,
    getTopTracks,
    refresh,
    getUserId,
    getPlaylists,
    getPlaylistDetail,
    getAlbums,
    getAlbumDetail,
    play,
    getAvailableDevices,
    addTrackToLibrary,
    deleteTrackFromLibrary,
    makePlaylist,
    addToPlaylist,
    search,
    getArtistAlbums,
    getArtistDetails,
    getArtistTopTracks,
    checkLibrary,
}

function login(user) {
    return axios.get(BASE_URL + "login/" + user).then(res => console.log(res)).catch(e => console.log("ERROR ", e))
}

function refresh(user) {
    return fetch(BASE_URL + 'refresh/' + user).then(res => res)
}

function getUserId(user) {
    return fetch(BASE_URL + 'me/' + user).then(res => res.json())
}

function getTracks(user) {
    return fetch(BASE_URL + 'tracks/' + user).then(res => res.json())
}

function getTopTracks(user) {
    return fetch(BASE_URL + 'top/' + user).then(res => res.json())
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

function addTrackToLibrary(user, trackId) {
    return fetch(BASE_URL + 'add/' + user + '/' + trackId).then(res => res.json());
}

function deleteTrackFromLibrary(user, trackId) {
    return fetch(BASE_URL + 'delete/' + user + '/' + trackId).then(res => res.json());
}

function makePlaylist(user) {
    return fetch(BASE_URL + 'makeplaylist/' + user).then(res => res.json());
}

function addToPlaylist(user, playlistId, trackId) {
    return fetch(BASE_URL + 'playlists/add/' + user + '/' + playlistId + '/' + trackId).then(res => res.json());
}

function search(user, search) {
    return fetch(BASE_URL + 'search/' + user + '/' + search).then(res => res.json());
}

function getArtistAlbums(user, artistId) {
    return fetch(BASE_URL + 'artists/albums/' + user + '/' + artistId).then(res => res.json());
}

function getArtistDetails(user, artistId) {
    return fetch(BASE_URL + 'artists/details/' + user + '/' + artistId).then(res => res.json());
}

function getArtistTopTracks(user, artistId) {
    return fetch(BASE_URL + 'artists/tracks/' + user + '/' + artistId).then(res => res.json());
}

function checkLibrary(user, trackId) {
    return fetch(BASE_URL + 'check/' + user + '/' + trackId).then(res => res.json());
}