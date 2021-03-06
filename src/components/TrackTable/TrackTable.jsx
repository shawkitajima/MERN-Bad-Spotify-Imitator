import React from 'react';
import styles from './TrackTable.module.css';
import TrackTableItem from '../TrackTableItem/TrackTableItem';

const TrackTable = props => {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Length</th>
                </tr>
                </thead>
                <tbody>
                    {props.tracks.map((track, idx) => <TrackTableItem 
                        title={track.track}
                        artist={track.artist}
                        artistId={track.artistId}
                        album={track.album}
                        albumId={track.albumId}
                        length={track.length}
                        key={idx}
                        uri={track.uri}
                        trackId={track.trackId}
                        user={props.user}
                        device={props.device}
                    />)}
                </tbody>
            </table>
        </>
    )
}

export default TrackTable