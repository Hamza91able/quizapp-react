import React, { Component } from 'react';
import './CourseDetails.css'
import firebase from '../../fire.js';

class CourseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderDetails: false,
            selectedQuiz: this.props.selectedQuiz,
            selectedQuizNo: "",
            quizes: [],
            existCheck: false,
            correctQuestions: 0,
            marks: 0,
            totalQuestions: "",
        }
        this.getQuizes = this.getQuizes.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.changeRenderDetailsState = this.changeRenderDetailsState.bind(this);
        this.checkExists = this.checkExists.bind(this);
    }

    componentDidMount() {
        this.getQuizes();
        this.changeRenderDetailsState();
    }

    checkExists(selectedQuizNumber) {
        if (selectedQuizNumber !== undefined) {
            const resultRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Results").child(this.state.selectedQuiz).child(selectedQuizNumber);
            resultRef.on('value', snap => {
                if (snap.exists()) {
                    this.setState({
                        existCheck: true,
                        correctQuestions: snap.child("correctQuestions").val(),
                        marks: snap.child("marks").val(),
                    })
                }
                else {
                    this.setState({
                        existCheck: false,
                    })
                }
            })
        }
    }

    getQuizes() {
        const { selectedQuiz } = this.state;
        const firebaseRef = firebase.database().ref("Quizes").child(selectedQuiz);
        firebaseRef.on("child_added", snap => {
            this.setState(prevState => ({
                quizes: [...prevState.quizes, snap.ref.path.pieces_[2]]
            }))
        })
    }

    changeRenderDetailsState(selectedQuizNumber) {
        this.checkExists(selectedQuizNumber);
        this.setState({
            renderDetails: true,
            selectedQuizNo: selectedQuizNumber,
        })
    }

    renderMenu() {
        const { quizes } = this.state;
        return (
            <div>
                <div className="vertical-menu col-md-3 col-xs-3 test">
                    <div className="test2" style={{ height: 700, marginTop: "15px" }}>
                        <a className="active">Quiz Title: {this.state.selectedQuiz}</a>
                        {quizes.map((value, index) => {
                            return (
                                <a onClick={this.changeRenderDetailsState.bind(this, value)} key={index++}>{value}</a>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    renderDetails() {
        const { selectedQuiz, selectedQuizNo } = this.state;
        const firebaseRef = firebase.database().ref("Quizes").child(selectedQuiz)
        let quizTitle = "", passingScore = "", quizDuration = "", totalQuestions = "";

        firebaseRef.on("child_added", snap => {
            if (snap.ref.path.pieces_[2] === selectedQuizNo) {
                quizTitle = snap.child("Quiz Title").val();
                passingScore = snap.child("Passing Score").val();
                quizDuration = snap.child("Quiz Duration").val();
                totalQuestions = snap.child("Total Questions").val();
            }
        });

        return (
            <div className="col-md-7 col-xs-7">
                <div className="title">
                    Welcome to {this.state.selectedQuiz} Quizes
                    <div className="col-md-7 col-xs-7 margin30" >
                        <div className="quiz-details">
                            {quizTitle !== "" && <div className="quiz-title"> Quiz Title: {quizTitle}</div>}
                            {passingScore !== "" && <div className="quiz-title">Passing Score: {passingScore}</div>}
                            {quizDuration !== "" && <div className="quiz-title"> Quiz Duration: {quizDuration} minutes</div>}
                            {totalQuestions !== "" && <div className="quiz-title"> Total Questions: {totalQuestions}</div>}
                            {quizTitle !== "" && <button style={{ marginTop: "35px" }} onClick={() => this.props.startQuiz(quizTitle, selectedQuizNo, quizDuration, totalQuestions)} disabled={this.state.existCheck} className="btn btn-info">CONTINUE</button>}
                            <button style={{ marginTop: "35px", marginLeft: "15px" }} onClick={this.props.changeState} className="btn btn-primary">BACK</button>
                        </div>
                        {this.state.existCheck && this.renderResult(quizTitle, totalQuestions)}
                    </div>
                </div>
            </div>
        )
    }

    renderResult(quizTitle, totalQuestions) {
        return (
            <div className="panel-group result2">
                <div className="panel panel-primary">
                    <div style={{ fontSize: "large", color: "white" }} className="panel-heading">Result</div>
                    <div style={{ fontSize: "large", color: "black" }} className="panel-body"><b>Quiz: </b> {quizTitle}</div>
                    <div style={{ fontSize: "large", color: "black" }} className="panel-body"><b>User: </b> {firebase.auth().currentUser.email}</div>
                    <div style={{ fontSize: "large", color: "black" }} className="panel-body"><b>Correct Questions: </b> {this.state.correctQuestions}/{totalQuestions}</div>
                    <div style={{ fontSize: "large", color: "black" }} className="panel-body"><b>Marks: </b> {this.state.marks}%</div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderMenu()}
                {this.state.renderDetails && this.renderDetails()}
            </div>
        )
    }
}

export default CourseDetails;