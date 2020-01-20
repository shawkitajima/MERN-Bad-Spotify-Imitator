import React, { Component } from 'react';
import SignupForm from '../../components/SignupForm/SignupForm';
import styles from './SignupPage.module.css'
import loginImage from '../LoginPage/LoginImage.jpg';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {message: ''}
  }

  updateMessage = (msg) => {
    this.setState({message: msg});
  }

  render() {
    return (
      <div className={styles.container}>
        <img src={loginImage} alt="sorry" />
        <div className={styles.formContainer}>
          <SignupForm {...this.props} updateMessage={this.updateMessage} />
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default SignupPage;