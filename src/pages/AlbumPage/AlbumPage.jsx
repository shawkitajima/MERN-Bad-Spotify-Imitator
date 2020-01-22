import React, {useState, useEffect} from 'react';
import spotifyService from '../../utils/spotifyService';
import { Link } from 'react-router-dom';
import styles from './AlbumPage.module.css'

const AlbumPage = props => {
    const [details, setDetails] = useState({albums: [
        {
            title: '',
            artist: '',
            img: '',
            id: ''
        }]});

    useEffect(() => {
        spotifyService.getAlbums(props.user._id).then(res => 
            setDetails(res))
    }, [props.user])

    return (
        <>
            <h1>Your Saved Albums</h1>
            <div className={styles.horiFlex}> 
                {details.albums.map((album, idx) =>
                    <div key={idx} className={styles.vertiFlex}>
                        <Link to={{
                            pathname: '/albumDetail',
                            album: album.id
                        }}>
                            <img src={album.img} alt="lol your browser sucks" />
                        </Link>
                        <h4>{album.title}</h4>
                        <p>{album.artist}</p>
                    </div>
            )} 
            </div>
        </>
    )
}

export default AlbumPage