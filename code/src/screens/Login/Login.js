import React, { Component } from 'react';
import './Login.css';
import swal from 'sweetalert';
import firebase from '../../fire.js'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            userLogin: '',
            userPassword: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    InputChange = () => {
        this.props.changeLoggedInState();
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    login() {
        const { userLogin, userPassword } = this.state;
        firebase.auth().signInWithEmailAndPassword(userLogin, userPassword).then(() => {
            this.InputChange();
        }).catch((error) => {
            swal("" + error);
        });
    }

    renderLogin() {
        return (
            <div className="sign-in-wrapper">
                <div className="graphs">
                    <div className="sign-in-form">
                        <div className="sign-in-form-top">
                            <h1>Log in</h1>
                        </div>
                        <div className="signin">
                            <form>
                                <div className="log-input">
                                    <div className="log-input-left">
                                        <input
                                            type="text"
                                            name="userLogin"
                                            value={this.state.userLogin}
                                            onChange={this.handleChange}
                                            className="user"
                                        />
                                    </div>
                                    <div className="clearfix"> </div>
                                </div>
                                <div className="log-input">
                                    <div className="log-input-left">
                                        <input
                                            type="password"
                                            name="userPassword"
                                            value={this.state.userPassword}
                                            onChange={this.handleChange}
                                            className="lock" />
                                    </div>
                                    <div className="clearfix"> </div>
                                </div>
                                <input onClick={() => this.login()} type="button" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    render() {
        return (
            <div>
                {this.renderLogin()}
            </div>
        )
    }
}

export default Login;