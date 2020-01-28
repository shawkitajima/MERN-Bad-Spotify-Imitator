import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import spotifyService from '../../utils/spotifyService';
import TrackTable from '../../components/TrackTable/TrackTable';
import styles from './SearchPage.module.css'

const SearchPage = props => {
    const [results, setResults] = useState({
        albums: [],
        artists: [],
        playlists: [],
        tracks: []
    });

    useEffect(() => {
        spotifyService.search(props.user._id, props.search).then(res => 
            setResults(res))
    }, [props.user, props.search])

    return (
        <>
            <h1>Search Results</h1>
            <h2>Albums</h2>
            <div className={styles.horiFlex}>
                {results.albums.slice(0,4).map((album, idx) =>
                    <div key={idx} className={styles.vertiFlex}>
                        <Link to={{
                            pathname: '/albumDetail',
                            album: album.id
                        }}>
                            <img src={album.img} alt="sorry :(" />
                        </Link>
                        <h4>{album.title}</h4>
                        <p>{album.artist}</p>
                    </div>
                )}
            </div>
            <h2>Artists</h2>
            <div className={styles.horiFlex}>
                {results.artists.slice(0,4).map((artist, idx) =>
                        <div key={idx} className={styles.vertiFlex}>
                            {/* <Link to={{
                                pathname: '/artistDetail',
                                artist: artist.id
                            }}> */}
                            <img src={artist.img} alt="sorry :(" />
                            {/* </Link> */}
                            <h4>{artist.name}</h4>
                        </div>
                )} 
            </div>
            <h2>Playlists</h2>
            <div className={styles.horiFlex}>
                {results.playlists.slice(0,4).map((playlist, idx) =>
                    <div key={idx} className={styles.vertiFlex}>
                        <Link to={{
                            pathname: '/playlistDetail',
                            playlist: playlist
                        }}>
                            <img src={playlist.img} alt="sorry :(" />
                        </Link>
                        <h4>{playlist.title}</h4>
                        <p>{playlist.owner}</p>
                    </div>
                )}
            </div>
            <h2>Tracks</h2>
            <TrackTable tracks={results.tracks} user={props.user} device={props.device} src={props.src} />
        </>
    )
};

export default SearchPage;