import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import spotifyService from '../../utils/spotifyService';
import TrackTable from '../../components/TrackTable/TrackTable';
import styles from './ArtistPage.module.css';

const ArtistPage = props => {
    const [albums, setAlbums] = useState({albums: []});
    const [tracks, setTracks] = useState({tracks: []});
    const [details, setDetails] = useState({});

    useEffect(() => {
        spotifyService.getArtistAlbums(props.user._id, props.history.location.artist).then(res => setAlbums(res));
        spotifyService.getArtistDetails(props.user._id, props.history.location.artist).then(res => setDetails(res));
        spotifyService.getArtistTopTracks(props.user._id, props.history.location.artist).then(res => setTracks(res));
    }, [props.user, props.history.location.artist])

    return (
        <>
            <div className={styles.horiFlex}>
                <img src={details.artist ? details.artist.img : null} alt='your browser sucks'/>
                <h1 className={styles.push}>{details.artist ? details.artist.name : 'loading'}</h1>
            </div>
            <h2>Albums</h2>
            <div className={styles.horiFlex}>
                {albums.albums.map((album, idx) =>
                    <div key={idx} className={styles.vertiFlex}>
                        <Link to={{
                            pathname: '/albumDetail',
                            album: album.id
                        }}>
                            <img src={album.img} alt="sorry :(" />
                        </Link>
                        <h4>{album.title}</h4>
                    </div>
                )}
            </div>
            <h2>Tracks</h2>
            <TrackTable tracks={tracks.tracks} user={props.user} device={props.device} src={props.src} />
        </>
    )
};

export default ArtistPage;