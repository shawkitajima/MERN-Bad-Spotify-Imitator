import React, {useState, useEffect} from 'react';
import spotifyService from '../../utils/spotifyService';
import styles from './PlaylistPage.module.css'
import TrackTable from '../../components/TrackTable/TrackTable';
import { formatTime } from '../../utils/utilities';

const PlaylistPage = props => {
    const [details, setDetails] = useState({playlist: {count: 0, length: 0}, tracks: []})
    const playlist = props.history.location.playlist

    useEffect(() => {
        spotifyService.getPlaylistDetail(props.user._id, playlist.id).then(res => 
            setDetails(res))
    }, [playlist, props.user._id])

    return (
        <>
            <div className={styles.horiFlex}>
                <img src={playlist.img} alt='your browser sucks'/>
                <div className={`${styles.vertiFlex} ${styles.push}`}>
                    <h1>{playlist.title}</h1>
                    <h2>Playlist by {playlist.owner}</h2>
                    <h2>{details.playlist.count} songs | {formatTime(Math.floor(details.playlist.length / 1000 / 60))}</h2>
                </div>
            </div>
            <TrackTable tracks={details.tracks} />
        </>
    )
}

export default PlaylistPage