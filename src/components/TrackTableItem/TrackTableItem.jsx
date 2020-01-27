import React from 'react';
import styles from './TrackTableItem.module.css';
import spotifyService from '../../utils/spotifyService';
import PlaylistSelector from '../../components/PlaylistSelector/PlaylistSelector';
import { formatTime } from '../../utils/utilities';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import playIcon from './play.png';
import color from '@material-ui/core/colors/amber';
import { findByLabelText } from '@testing-library/react';

const TrackTableItem = props => {
    let time = formatTime(Math.floor(props.length / 1000))

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [show, setShow] = React.useState(false)

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
                {props.src ? (
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
        <td>{props.artist}</td>
        <td>{props.album}</td>
        <td>{time}</td>
    </tr>
    )
}

export default TrackTableItem;