import React from 'react';
import styles from './TrackTable.module.css';
import TrackTableItem from '../TrackTableItem/TrackTableItem';

const TrackTable = props => {
    // model data for now
    const tracks = [
        {
            title: 'Mo Money Mo Problems',
            artist: 'Biggie Smalls',
            album: 'Life After Death',
            length: '4:05'
        },
        {
            title: 'Meet Me Halfway',
            artist: 'The Black Eyed Peas',
            album: 'The Beggigning and the Best',
            length: '4:44'
        },
    ]
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Length</th>
                </tr>
                </thead>
                <tbody>
                    {tracks.map(track => <TrackTableItem 
                        title={track.title}
                        artist={track.artist}
                        album={track.album}
                        length={track.length}
                    />)}
                </tbody>
            </table>
        </>
    )
}

export default TrackTable