import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import userService from '../../utils/userService';
import spotifyService from '../../utils/spotifyService';
import './App.css';
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import WelcomePage from '../WelcomePage/WelcomePage';
import UserPage from '../UserPage/UserPage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: userService.getUser()
    };
  }

  /*--- Callback Methods ---*/
  handleLogout = () => {
    userService.logout();
    this.setState({user: null})
  }

  handleSignupOrLogin = () => {
    this.setState({user: userService.getUser()})
  }

  handleSpotifyLogin = () => {
    spotifyService.login(this.state.user._id)
  }
  /*--- Lifecycle Methods ---*/

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' render={() => (
            userService.getUser() ?
            <UserPage 
              user={this.state.user} 
              handleLogout={this.handleLogout}
            />
            :
           <Redirect to='/welcome' />
          )
          }/>
          <Route exact path='/signup' render={({ history }) => 
            <SignupPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          }/>
          <Route exact path='/login' render={({history}) => 
            <LoginPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          }/>
          <Route exact path='/welcome' render={() => 
            <WelcomePage/>
          }/>
        </Switch>
      </div>
    );
  }
}

export default App;
