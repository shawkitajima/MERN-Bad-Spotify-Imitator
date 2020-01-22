const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../../controllers/spotify');

/*---------- Public Routes ----------*/
router.get('/login/:id', spotifyCtrl.login);
router.get('/refresh/:id', spotifyCtrl.refresh);
router.get('/tracks/:id', spotifyCtrl.getTracks);
router.get('/albums/:id', spotifyCtrl.getAlbums);
router.get('/albums/:id/:albumId', spotifyCtrl.getAlbumDetail)
router.get('/playlists/:id', spotifyCtrl.getPlaylists);
router.get('/playlists/:id/:playlistId', spotifyCtrl.getPlaylistDetail);
router.get('/play/:id/:trackId/:deviceId', spotifyCtrl.play);
router.get('/top/:id', spotifyCtrl.getTopTracks);
router.get('/devices/:id', spotifyCtrl.getAvailableDevices);
router.get('/callback', spotifyCtrl.callback);

/*---------- Protected Routes ----------*/




module.exports = router;