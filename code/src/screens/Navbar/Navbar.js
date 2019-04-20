import React, { Component } from 'react';
import Register from '../Register/Register';
import firebase from '../../fire';
import swal from 'sweetalert';
import Button from 'react-bootstrap/es/Button';
import Modal from 'react-bootstrap/es/Modal';
import Label from 'react-bootstrap/es/Label';

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            showRegister: false,
            showLogin: false,
            courses: [],
            show: false,
        }
        this.showRegister = this.showRegister.bind(this);
        this.showLogin = this.showLogin.bind(this);
        this.logOut = this.logOut.bind(this);
        this.getCourses = this.getCourses.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        this.getCourses();
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    showLogin() {
        console.log("Show Login");
        this.props.showLogin();
    }


    showRegister() {
        console.log("Show Register");
        this.props.changeLoggedInState();
    }

    logOut() {
        firebase.auth().signOut().then(() => {
            this.props.logOut();
            swal("Logged Out Successfully");
        }).catch(function (error) {
            swal("An Error Occured: " + error);
        });
    }

    getCourses() {
        const firebaseDB = firebase.database();
        const firebaseRef = firebaseDB.ref("Quizes");
        firebaseRef.on("child_added", (snap) => {
            this.setState(prevState => ({
                courses: [...prevState.courses, snap.ref.path.pieces_[1]]
            }))
        })
    }

    renderModal() {
        this.handleShow();
    }

    renderNavBar() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        {this.props.quizStart === true ? <a className="navbar-brand">Quiz Application</a> : <a onClick={this.props.showDashBoard} className="navbar-brand">Quiz Application</a>}
                    </div>
                    <ul className="nav navbar-nav navbar-right">
                        {!this.props.isLoggedIn && <li><a onClick={this.showRegister}><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>}
                        {/* <li><a onClick={this.renderModal}><span className="glyphicon glyphicon-plus"></span> Create Quiz</a></li> */}
                        {!this.props.isLoggedIn && <li><a onClick={this.showLogin}><span className="glyphicon glyphicon-log-in"></span> Login</a></li>}
                    </ul>
                    {this.props.isLoggedIn && <ul className="nav navbar-nav navbar-right">
                        {this.props.quizStart === true ? <li><a><span className="glyphicon glyphicon-user"></span> Welcome: {firebase.auth().currentUser.email}</a></li> : <li><a onClick={this.props.showDashBoard}><span className="glyphicon glyphicon-user"></span> Welcome: {firebase.auth().currentUser.email}</a></li>}
                        {!this.props.onCreateQuiz && !this.props.quizStart && <li><a onClick={this.renderModal}><span className="glyphicon glyphicon-plus"></span> Create Quiz</a></li>}
                        {this.props.quizStart === true ? <li><a><span className="glyphicon glyphicon-log-out"></span> Logout</a></li> : <li><a onClick={this.logOut}><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>}
                    </ul>}
                </div>
            </nav>
        )
    }

    render() {
        const { courses } = this.state;
        return (
            <div>
                {this.renderNavBar()}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select From Existing Courses</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="panel-group">
                            <div className="panel panel-primary">
                                {courses.map((value, index) => {
                                    return (
                                        <div className="panel-body" key={index++}>{value} <button onClick={() => { this.props.selectedCourse(value); this.handleClose(); }} style={{ float: "right" }} className="btn btn-info">OPEN</button></div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="panel-group">
                            <div className="panel panel-primary">
                                <div className="panel-body">
                                    <h3>
                                        <Label bsStyle="primary">New Category Quiz: </Label>{' '}
                                        <button className="btn btn-info" onClick={() => swal("Under Construction")} style={{ float: "right" }}>Create New Quiz</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
                {this.state.showRegister && <Register />}
            </div>
        )
    }
}

export default Navbar;