import React, {useState, useEffect} from 'react'
import spotifyService from '../../utils/spotifyService'
import MenuItem from '@material-ui/core/MenuItem';

const PlaylistSelector = props => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        spotifyService.getPlaylists(props.user._id).then(res => {
            let matches = [];
            res.playlists.forEach(playlist => {
                if (playlist.ownerId === props.user.spotifyId) {
                    matches.push(playlist);
                }
            })
            setPlaylists(matches);
        })
    }, [props.user])
    return (
        <>
            {playlists.map((playlist, idx) => (
                <MenuItem key={idx} onClick={() => {
                    spotifyService.addToPlaylist(props.user._id, playlist.id, props.track);
                    props.handleClose();
                }}>{playlist.title}</MenuItem>
            ))}
        </>
    )
}

export default PlaylistSelector;