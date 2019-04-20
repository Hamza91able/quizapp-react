import React, { Component } from 'react';
import './Register.css';
import firebase from '../../fire.js'
import swal from 'sweetalert'

class Regiser extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    registerUser() {
        const { email, password, confirmPassword } = this.state;
        console.log("TEST");
        if (password === confirmPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
                this.props.changeLoggedInState();
                swal("Registered and Logged In");
            }).catch((error) => {
                swal("" + error);
            });
        }
        else {
            swal("Password Didn't Match");
        }
    }

    renderRegister() {
        return (
            <div className="sign-in-wrapper">
                <div className="graphs">
                    <div className="sign-up">
                        <h1 id="h1-tag">Create an account</h1>
                        <div id="register-div">
                            <p id="creating" className="creating">Please fill out the required Information.</p>
                            <h2>Personal Information</h2>
                            <div className="sign-u">
                                <div className="sign-up1">
                                    <h4>Email Address* :</h4>
                                </div>
                                <div className="sign-up2">
                                    <form>
                                        <input
                                            id="emailReg"
                                            type="text"
                                            name="email"
                                            placeholder=" "
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            required=" " />
                                    </form>
                                </div>
                                <div className="clearfix"> </div>
                            </div>
                            <div className="sign-u">
                                <div className="sign-up1">
                                    <h4>Password* :</h4>
                                </div>
                                <div className="sign-up2">
                                    <form>
                                        <input
                                            id="passwordReg"
                                            type="password"
                                            name="password"
                                            placeholder=" "
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            required=" " />
                                    </form>
                                </div>
                                <div className="clearfix"> </div>
                            </div>
                            <div className="sign-u">
                                <div className="sign-up1">
                                    <h4>Confirm Password* :</h4>
                                </div>
                                <div className="sign-up2">
                                    <form>
                                        <input
                                            id="confirmPasswordReg"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder=" "
                                            value={this.state.confirmPassword}
                                            onChange={this.handleChange}
                                            required=" " />
                                    </form>
                                </div>
                                <div className="clearfix"> </div>
                            </div>
                            <div className="sub_home">
                                <div className="sub_home_left">
                                    <input id="register-brn" onClick={this.registerUser.bind(this)} type="submit" value="Create Account" />
                                </div>
                                <div className="clearfix"> </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderRegister()}
            </div>
        )
    }
}

export default Regiser;