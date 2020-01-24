const User = require('../models/user');
const jwt = require('jsonwebtoken');
const request = require('request');
const querystring = require('querystring');
 
function todaysDate() {
    let currentTime = new Date()
    let month = currentTime.getMonth() + 1
    let day = currentTime.getDate()
    let year = currentTime.getFullYear()
    return `${year}-${month}-${day}`
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = {
  login,
  callback,
  refresh,
  getTracks,
  getAlbums,
  getAlbumDetail,
  getPlaylists,
  getPlaylistDetail,
  getTopTracks,
  play,
  getAvailableDevices,
  makeCommunityPlaylist
};

function login(req, res) {
    const scopes = 'streaming playlist-modify-private playlist-modify-public playlist-read-private user-library-read user-modify-playback-state user-top-read user-read-playback-state user-library-modify user-read-email user-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.SPOTIFY_CALLBACK,
      state: req.params.id
    }));
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
            res.redirect('/');
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
                    User.findByIdAndUpdate(user.id, {spotifyToken, tokenExpiration}, {new: true}, function(err, updatedUser) {
                        return res.send({
                            user: updatedUser
                        });
                    })
                }
            })
        }
        else {
            return res.send({user})
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

function play(req, res) {
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        };
        
        const dataString = `{"uris":["${req.params.trackId}"],"position_ms":"0"}`;
        
        var options = {
            url: `https://api.spotify.com/v1/me/player/play?device_id=${req.params.deviceId}`,
            method: 'PUT',
            headers: headers,
            body: dataString
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                res.send(body);
            }
        }
        request(options, callback);
    })
}

function getAvailableDevices(req, res) {
    let devices = [];
    User.findById(req.params.id, function(err, user) {
        const access_token = user.spotifyToken;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token 
        };
        const options = {
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: headers
        };
        function callback(error, response, body) {
            if (error) console.log(error);
            if (!error && response.statusCode == 200) {
                let parsed = JSON.parse(body);
                parsed.devices.forEach(device => {
                    devices.push({
                        id: device.id,
                        name: device.name
                    });
                });
                res.send({devices});
            }
        }
        request(options, callback);
    });
}

function makeCommunityPlaylist(req, res) {
    User.findById(req.params.id, function(err, user) {
        getUserDetails(user.spotifyToken, function(err, response) {
            let parsed = JSON.parse(response.body);
            initializePlaylist(user.spotifyToken, parsed.id, function(err, playlist) {
                if (err) console.log(err);
                let parsed = JSON.parse(playlist.body);
                let tracks = [];
                User.find({}, function(err, users) {
                    users.forEach(user => {
                        tracks = tracks.concat(user.topTracks)
                    })
                    let tracksSet = new Set(tracks);
                    let allTracks = [...tracksSet];
                    let sliced = allTracks.slice(0, 30);
                    let shuffled = shuffle(sliced);
                    addTracks(user.spotifyToken, parsed.id, shuffled, function(err, tracks) {
                        if (err) console.log(err)
                        res.send({tracks});
                    });
                });
            });
        });        
    });
}

function getUserDetails(token, callback) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token 
    };
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: headers
    };
    request(options, callback);
}

function initializePlaylist(token, id, callback) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  token
    };
    
    const dataString = `{"name":"Our Community Playlist ${todaysDate()}","description":"A fun playlist made by our community","public":false}`;
    
    const options = {
        url: `https://api.spotify.com/v1/users/${id}/playlists`,
        method: 'POST',
        headers: headers,
        body: dataString
    };
    request(options, callback);
}

function addTracks(token, id, uris, callback) {
    const headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
    };
    const options = {
        url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
        method: 'POST',
        headers: headers,
        form: JSON.stringify({uris: uris})
    };
    request(options, callback);
}