import React, { Component } from 'react';
import './Dashboard.css';
import firebase from '../../fire.js';


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            courses: [],
            joinedCourses: [],
        }
        this.getCourses = this.getCourses.bind(this);
        this.getJoinedCourses = this.getJoinedCourses.bind(this);
    }

    componentWillMount() {
        this.getCourses();
        this.getJoinedCourses();
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

    saveJoin(value) {
        this.props.changeState(value);
        this.saveJoinedCourses(value);
    }

    saveJoinedCourses(value) {
        const firebaseRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("JoinedCourses");
        firebaseRef.ref.push().set({
            joinedCourses: value,
        })
    }

    getJoinedCourses() {
        const firebaseRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("JoinedCourses");
        firebaseRef.once("value", snap => {
            snap.forEach(snap2 => {
                snap2.forEach(snap3 => {
                    this.setState(prevState => ({
                        joinedCourses: [...prevState.joinedCourses, snap3.val()]
                    }));
                })
            })
        });
    }

    renderJoinedCourses() {
        return (
            <div className="panel-group joined-courses">
                <div className="panel panel-primary">
                    <div className="panel-heading">Joined Courses</div>
                    {this.state.joinedCourses.map((value, index) => {
                        return (
                            <div className="panel-body" key={index++}>{value} <button onClick={() => this.props.changeState(value)} style={{ float: "right" }} className="btn btn-info">OPEN</button></div>
                        )
                    })}
                </div>
            </div>
        )
    }

    renderUser() {
        return (
            <div className="panel-group user-loggedin">
                <div className="panel panel-primary">
                    <div className="panel-heading">Logged In User</div>
                    <div className="panel-body">Welcome: {firebase.auth().currentUser.email}</div>
                </div>
            </div>
        )
    }

    renderCourses() {
        const { courses } = this.state;
        let test = false;
        
        return (
            <div className="panel-group quiz-list">
                <div className="panel panel-primary">
                    <div className="panel-heading">Recomended Courses</div>
                    {courses.map((value, index) => {
                        if (this.state.joinedCourses.includes(value))
                            test = true
                        else
                            test = false
                        return (
                            <div className="panel-body" key={index++}>{value} {!test ? <button className="btn btn-info join-btn" onClick={() => this.saveJoin(value)}>JOIN</button> : <button disabled={true} className="btn btn-warning join-btn">JOINED</button>}</div>
                        )
                    })}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderUser()}
                {this.renderJoinedCourses()}
                {this.renderCourses()}
            </div>
        )
    }
}

export default Dashboard;