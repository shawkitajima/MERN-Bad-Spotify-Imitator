import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import spotifyService from '../../utils/spotifyService';
import PlaylistSelector from '../../components/PlaylistSelector/PlaylistSelector';
import { formatTime } from '../../utils/utilities';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const TrackTableItem = props => {
    let time = formatTime(Math.floor(props.length / 1000))

    const [anchorEl, setAnchorEl] = useState(null);

    const [contains, setContains] = useState(false);

    const [show, setShow] = useState(false)

    useEffect(() => {
        spotifyService.checkLibrary(props.user._id, props.trackId).then(res => setContains(res.contained))
    }, [props.user._id]);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
    <tr>
        <td>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <div style={{color: 'white'}}>...</div>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                        spotifyService.play(props.user._id, props.uri, props.device);
                        handleClose();
                    }}>Play</MenuItem>
                {contains ? (
                    <MenuItem onClick={() => {
                        spotifyService.deleteTrackFromLibrary(props.user._id, props.trackId);
                    }}>Remove From Library</MenuItem>
                ) 
                : 
                (
                    <MenuItem onClick={() => {
                        spotifyService.addTrackToLibrary(props.user._id, props.trackId);
                        handleClose();
                    }}>Add to Library</MenuItem>
                )
                }
                <MenuItem onClick={() => setShow(!show)}>Add To Playlist</MenuItem>
                { show && 
                    <PlaylistSelector user={props.user} track={props.uri} handleClose={handleClose}/>
                }
                <MenuItem onClick={handleClose}>Close</MenuItem>
            </Menu>
        </td>
        <td>{props.title}</td>
        <td>
            <Link 
                to={{
                    pathname: '/artistDetail',
                    artist: props.artistId
                }}
                style={{color: 'white'}}
            >
                {props.artist}
            </Link>
        </td>
        <td>
            <Link 
                to={{
                    pathname: '/albumDetail',
                    album: props.albumId
                }}
                style={{color: 'white'}}
            >
                {props.album}
            </Link>
        </td>
        <td>{time}</td>
    </tr>
    )
}

export default TrackTableItem;