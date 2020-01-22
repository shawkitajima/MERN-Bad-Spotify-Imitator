import React, {useState, useEffect} from 'react';
import spotifyService from '../../utils/spotifyService';
import styles from './AlbumDetailPage.module.css'
import TrackTable from '../../components/TrackTable/TrackTable';
import { formatTime } from '../../utils/utilities';

const AlbumDetailPage = props => {
    const [details, setDetails] = useState({
        album: {
            img: '',
            name: '',
            artist: '',
            year: '',
            count: '',
            length: '',
            }, 
        tracks: []})

    useEffect(() => {
        spotifyService.getAlbumDetail(props.user._id, props.history.location.album).then(res => 
            setDetails(res))
    }, [props.user, props.history.location.album])

    return (
        <>
            <div className={styles.horiFlex}>
                <img src={details.album.img} alt='your browser sucks'/>
                <div className={`${styles.vertiFlex} ${styles.push}`}>
                    <h1>{details.album.name}</h1>
                    <h2>By: {details.album.artist}</h2>
                    <h2>{details.album.year} | {details.album.count} songs | {formatTime(Math.floor(details.album.length / 1000 / 60))}</h2>
                </div>
            </div>
            <TrackTable tracks={details.tracks} user={props.user} device={props.device} />
        </>
    )
}

export default AlbumDetailPage