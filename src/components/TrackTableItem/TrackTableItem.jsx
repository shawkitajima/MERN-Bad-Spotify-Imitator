import React from 'react';
import styles from './TrackTableItem.module.css';
import spotifyService from '../../utils/spotifyService';
import { formatTime } from '../../utils/utilities';
import playIcon from './play.png';

const TrackTableItem = props => {
    let time = formatTime(Math.floor(props.length / 1000))
    return (
    <tr>
        <td><img className={styles.playIcon} src={playIcon} alt={"sorry"}onClick={() => spotifyService.play(props.user._id, props.uri, props.device)}/></td>
        <td>{props.title}</td>
        <td>{props.artist}</td>
        <td>{props.album}</td>
        <td>{time}</td>
    </tr>
    )
}

export default TrackTableItem;