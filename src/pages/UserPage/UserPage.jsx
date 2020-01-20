import React from 'react';
import NavBar from '../../components/NavBar/NavBar'
import TrackTable from '../../components/TrackTable/TrackTable';

const UserPage = (props) => {
    return (
        <>
            <h1>Your Saved Songs</h1>
            <NavBar   
            user={props.user} 
            handleLogout={props.handleLogout}
            />
            < TrackTable
                user={props.user}
             />
        </>
    )
}

export default UserPage;