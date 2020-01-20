import React from 'react';
import './WelcomePage.css'
import WelcomeImage from './WelcomeImage.jpg'
import { Link } from 'react-router-dom';

const WelcomePage = props => {
    return (
        <div className="WelcomePagecontainer">
            <img src={WelcomeImage} alt="sorry"/>
            <div className="WelcomePagewelcome">Some Spotify Fun</div>
            <div className="WelcomePagebutton-container">
                <Link to='/login' className='NavBar-link'><button className="WelcomePagebtn">Login</button></Link>
                <div className="WelcomePageor">or</div>
                <Link to='/signup' className='NavBar-link'><button className="WelcomePagebtn">Signup</button></Link>
            </div>
        </div> 
    )
}

export default WelcomePage;