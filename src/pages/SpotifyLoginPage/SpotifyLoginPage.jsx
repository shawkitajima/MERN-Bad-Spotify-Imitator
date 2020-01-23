import React from 'react'
import spotifyService from '../../utils/spotifyService'

const SpotifyLoginPage = props => {
    return (
        <>
        <h1>Welcome to the Spotify Bad Imitator Application!</h1>
        <p>To use this application, you will need authorize us to access you Spotify Premium account!</p>
        <p>To do so, please work with Spotify using the below button!</p>
        <button><a href={`/api/spotify/login/${props.user._id}`}>Authorize</a></button>
        </>
    )
}

export default SpotifyLoginPage;