import React, {useState, useEffect} from 'react';
import spotifyService from '../../utils/spotifyService';
import TrackTable from '../../components/TrackTable/TrackTable';

const SongPage = props => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        spotifyService.getTracks(props.user._id).then(res => 
            setTracks(res.tracks))
    }, [props.user])

    return (
        <>
            <h1>Your Saved Songs</h1>
            <TrackTable tracks={tracks} user={props.user} device={props.device} src={props.src} />
        </>
    )
}

export default SongPage