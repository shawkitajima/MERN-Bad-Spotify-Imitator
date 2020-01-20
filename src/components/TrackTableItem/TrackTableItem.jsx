import React from 'react';
import styles from './TrackTableItem.module.css';

const TrackTableItem = props => {
    return (
    <tr>
        <td>{props.title}</td>
        <td>{props.artist}</td>
        <td>{props.album}</td>
        <td>{props.length}</td>
    </tr>
    )
}

export default TrackTableItem;