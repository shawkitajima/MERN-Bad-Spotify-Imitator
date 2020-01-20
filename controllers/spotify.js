const User = require('../models/user');
const jwt = require('jsonwebtoken');
const request = require('request') 

module.exports = {
  login,
  callback,
  refresh,
  getTracks,
  getAlbums,
  getAlbumDetail,
  getPlaylists,
  getPlaylistDetail,
  getTopTracks
};

function login(req, res) {
    const scopes = 'streaming playlist-modify-public playlist-read-private user-library-read user-modify-playback-state user-top-read';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(process.env.SPOTIFY_CALLBACK) + '&state=' + req.params.id);
};

function callback(req, res) {
    const code = req.query.code;
    const id = req.query.state
    const url = 'https://accounts.spotify.com/api/token'
    const data = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_CALLBACK,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_SECRET
    }
    const options = {
        method: 'POST',
        url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: data
    }
    request.post(url, options, function(err, response) {
        if (err) console.log(err);
        let body = JSON.parse(response.body);
        let tokenExpiration = body.expires_in * 1000 + Date.now();
        let accessToken = body.access_token;
        let refreshToken = body.refresh_token;
        User.findByIdAndUpdate(id, {spotifyToken: accessToken, spotifyRefresh: refreshToken, tokenExpiration}, function(err, user) {
            res.send({status: 'okay'});
        })
    })
}

function refresh(req, res) {
    User.findById(req.params.id, (err, user) => {
        if (user.tokenExpiration - Date.now() < 0 ) {
            const refresh_token = user.spotifyRefresh;
            const authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))},
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: refresh_token
                },
                json: true
            };
            request.post(authOptions, function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let spotifyToken = body.access_token;
                    let tokenExpiration = body.expires_in * 1000 + Date.now();
                    User.findByIdAndUpdate(user.id, {spotifyToken, tokenExpiration}, function(err, updatedUser) {
                        return res.send({
                            'access_token': body.access_token,
                            'tokenExpiration': body.expires_in * 1000 + Date.now()
                        });
                    })
                }
            })
        }
        else {
            return res.send({'message': 'no need to refresh'})
        }
    })
}

function getTracks(req, res) {
    let tracks = [];
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: 'https://api.spotify.com/v1/me/tracks?limit=50',
            headers: headers
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.items.forEach(track => {
                    tracks.push({
                        track: track.track.name,
                        artist: track.track.album.artists.map(artist => artist.name).join(', '),
                        album: track.track.album.name,
                        length: track.track.duration_ms,
                        uri: track.track.uri,
                    })
                })
                res.send({tracks})
            }
        }
        request(options, callback);
    })
}

function getAlbums(req, res) {
    let albums = [];
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: 'https://api.spotify.com/v1/me/albums?limit=50',
            headers: headers
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.items.forEach(album => {
                    albums.push({
                        title: album.album.name,
                        artist: album.album.artists.map(artist => artist.name).join(', '),
                        img: album.album.images[0].url,
                        id: album.album.id
                    })
                })
                res.send({albums})
            }
        }
        request(options, callback);
    })
}

function getAlbumDetail(req, res) {
    let tracks = [];
    let album = {}
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: `https://api.spotify.com/v1/albums/${req.params.albumId}`,
            headers: headers
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.tracks.items.forEach(track => {
                    tracks.push({
                        track: track.name,
                        artist: track.artists.map(artist => artist.name).join(', '),
                        album: parsed.name,
                        length: track.duration_ms,
                        uri: track.uri
                    })
                })
                album.img = parsed.images[0].url; 
                album.name = parsed.name;
                album.artist = parsed.artists.map(artist => artist.name).join(', ');
                album.year = parsed.release_date.slice(0, 4);
                album.count = parsed.total_tracks;
                album.length = tracks.reduce((acc, val) => (acc + val.length), 0); 
                res.send({album, tracks})
            }
        }
        request(options, callback);
    })
}

function getPlaylists(req, res) {
    let playlists = [];
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: headers
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.items.forEach(playlist => {
                    playlists.push({
                        title: playlist.name,
                        id: playlist.id,
                        img: playlist.images[0].url,
                        owner: playlist.owner.display_name    
                    })
                })
                res.send({playlists});
            }
        }
        request(options, callback);
    })
}

function getPlaylistDetail(req, res) {
    let tracks = [];
    let playlist = {}
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: `https://api.spotify.com/v1/playlists/${req.params.playlistId}/tracks?offset=0&limit=100`,
            headers: headers
        };
        function callback(error, response, body) {
            if (error) console.log(error);
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.items.forEach(track => {
                    tracks.push({
                        track: track.track.name,
                        artist: track.track.artists.map(artist => artist.name).join(', '),
                        album: track.track.album.name,
                        length: track.track.duration_ms,
                        uri: track.track.uri
                    })
                })
                playlist.count = tracks.length;
                playlist.length = tracks.reduce((acc, val) => (acc + val.length), 0); 
                res.send({playlist, tracks});
            }
        }
        request(options, callback);
    })
}

function getTopTracks(req, res) {
    let tracks = [];
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=30',
            headers: headers
        };
        function callback(error, response, body) {
            if (error) console.log(error);
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.items.forEach(track => {
                    tracks.push(track.uri)
                })
                User.findByIdAndUpdate(user._id, {topTracks: tracks}, function(err, user2) {
                    res.send({tracks});
                })
            }
        }
        request(options, callback);
    })
}

