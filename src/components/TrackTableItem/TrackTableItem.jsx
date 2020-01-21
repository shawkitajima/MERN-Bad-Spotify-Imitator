import React from 'react';
import styles from './TrackTableItem.module.css';
import { formatTime } from '../../utils/utilities';

const TrackTableItem = props => {
    let time = formatTime(Math.floor(props.length / 1000))
    return (
    <tr>
        <td>{props.title}</td>
        <td>{props.artist}</td>
        <td>{props.album}</td>
        <td>{time}</td>
    </tr>
    )
}

export default TrackTableItem;