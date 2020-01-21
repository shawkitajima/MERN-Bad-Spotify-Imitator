import React, {useState, useEffect} from 'react';
import styles from './TrackTable.module.css';
import TrackTableItem from '../TrackTableItem/TrackTableItem';
import spotifyService from '../../utils/spotifyService';

const TrackTable = props => {
    
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        spotifyService.getTracks(props.user._id).then(res => 
            setTracks(res.tracks))
    }, [])

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
                    {tracks.map((track, idx) => <TrackTableItem 
                        title={track.track}
                        artist={track.artist}
                        album={track.album}
                        length={track.length}
                        key={idx}
                    />)}
                </tbody>
            </table>
        </>
    )
}

export default TrackTable