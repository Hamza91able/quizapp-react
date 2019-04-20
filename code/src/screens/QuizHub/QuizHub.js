import React, { Component } from 'react';
import firebase from '../../fire.js'
import './QuizHub.css';
import swal from 'sweetalert';


class QuizHub extends Component {
    constructor() {
        super();
        this.state = {
            proctoringKey: 0,
            enteredProctoringKey: "",
            renderProctoringKey: true,
            startQuiz: false,
            renderResult: false,
            currentQuestionIndex: 0,
            userChoice: "",
            disableButton: true,
            Questions: [],
            wrongQues: 0,
            correctQues: 0,
        }
        this.verifyKey = this.verifyKey.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderQuiz = this.renderQuiz.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.startTime = this.startTime.bind(this);
        this.getKey = this.getKey.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
        this.getKey();
    }

    getKey() {
        const { selectedQuizNo, quizTitle } = this.props;
        const firebaseRef = firebase.database().ref("Quizes").child(quizTitle).child(selectedQuizNo)
        firebaseRef.on('value', snap => {
            this.setState({
                proctoringKey: snap.child("Proctoring Key").val(),
            })
        })
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    verifyKey() {
        const { enteredProctoringKey, proctoringKey } = this.state;
        if (enteredProctoringKey === proctoringKey.toString()) {
            this.startTime();
            this.setState({
                renderProctoringKey: false,
                startQuiz: true,
            })
        }
        else {
            swal("Wrong Key");
        }
    }

    getQuestions() {
        const { selectedQuizNo, quizTitle } = this.props;
        const firebaseRef = firebase.database().ref("Quizes").child(quizTitle).child(selectedQuizNo).child("Questions");
        firebaseRef.on("value", snap => {
            this.setState(prevState => ({
                Questions: [...prevState.Questions, snap.val()]
            }))
        })

    }

    saveResult(marks) {
        const { selectedQuizNo, quizTitle } = this.props;
        const firebaseRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Results").child(quizTitle).child(selectedQuizNo);
        firebaseRef
        firebaseRef.set({
            name: firebase.auth().currentUser.email,
            Quiz: this.props.selectedQuiz,
            totalQuestions: this.props.totalQuestions,
            correctQuestions: this.state.correctQues,
            marks: marks,
        })
    }

    nextQuestion(userChoice, cQues) {
        const { currentQuestionIndex } = this.state;
        if (cQues.Answer === userChoice) {
            let { correctQues } = this.state;
            correctQues = correctQues + 1;
            this.setState({
                correctQues: correctQues,
            })
        }
        else {
            let { wrongQues } = this.state;
            wrongQues = wrongQues + 1;
            this.setState({
                wrongQues: wrongQues,
            })
        }
        this.setState({
            currentQuestionIndex: currentQuestionIndex + 1,
            disableButton: true,
        })
        this.opt1.checked = false;
        this.opt2.checked = false;
        this.opt3.checked = false;
        this.opt4.checked = false;
    }

    startTime() {
        let quizDurationSeconds = this.props.quizDuration * 60;
        let showDuration = quizDurationSeconds;
        let startTIme = 0;
        let timeFunc = setInterval(() => {
            startTIme++;
            showDuration--
            var hours = Math.floor(showDuration / 3600);
            var min = Math.floor((showDuration - (hours * 3600)) / 60);
            var seconds = Math.floor(showDuration % 60);
            let remainingTime = min + ":" + seconds;
            if (this.time !== null) {
                this.time.innerHTML = remainingTime + " minutes";
            }
            else {
                clearInterval(timeFunc);
            }
            if (startTIme >= quizDurationSeconds) {
                this.setState({
                    renderResult: true,
                    startQuiz: false,
                })
                clearInterval(timeFunc);
            }
        }, 1000)
    }

    renderQuiz() {
        const { Questions, currentQuestionIndex } = this.state;
        let QTile, choice_1, choice_2, choice_3, choice_4 = "";
        let cQues;

        Questions.map(value => {
            let ques = Object.values(value)
            cQues = ques[currentQuestionIndex];
            if (currentQuestionIndex > this.props.totalQuestions - 1) {
                this.setState({
                    renderResult: true,
                    startQuiz: false,
                })
            }
            else {
                QTile = cQues.Question
                choice_1 = cQues.Choice_1;
                choice_2 = cQues.Choice_2;
                choice_3 = cQues.Choice_3;
                choice_4 = cQues.Choice_4;
            }
        })
        return (
            <div className="panel-group questions">
                <div className="panel panel-primary">
                    <div className="panel-heading">{QTile} <p ref={input => { this.time = input }} style={{ float: "right" }}>{}</p></div>
                    <div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt1 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, userChoice: choice_1 }) }} value={choice_1} name="optradio" />{choice_1}</label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt2 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, userChoice: choice_2 }) }} value={choice_2} name="optradio" />{choice_2}</label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt3 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, userChoice: choice_3 }) }} value={choice_3} name="optradio" />{choice_3}</label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt4 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, userChoice: choice_4 }) }} value={choice_4} name="optradio" />{choice_4}</label>
                            </div>
                        </div>
                    </div>
                </div>

                {<button className="btn btn-info" disabled={this.state.disableButton} onClick={() => this.nextQuestion(this.state.userChoice, cQues)} style={{ float: "right", marginTop: "15px" }}>Next</button>}


            </div>
        )
    }

    renderResult() {
        let marks = (this.state.correctQues / this.props.totalQuestions) * 100;
        this.saveResult(marks);
        return (
            <div className="panel-group result">
                <div className="panel panel-primary">
                    <div style={{ fontSize: "large" }} className="panel-heading">Result</div>
                    <div style={{ fontSize: "large" }} className="panel-body"><b>Quiz: </b> {this.props.selectedQuiz}</div>
                    <div style={{ fontSize: "large" }} className="panel-body"><b>User: </b> {firebase.auth().currentUser.email}</div>
                    <div style={{ fontSize: "large" }} className="panel-body"><b>Correct Questions: </b> {this.state.correctQues}/{this.props.totalQuestions}</div>
                    <div style={{ fontSize: "large" }} className="panel-body"><b>Marks: </b> {marks}%</div>
                </div>
                <button onClick={this.props.changeState} style={{ marginTop: "25px", float: "right" }} className="btn btn-success">CONTINUE</button>
            </div>
        )
    }

    renderProctoringKey() {
        return (
            <div className="panel-group pr-key">
                <div className="panel panel-primary">
                    <div className="panel-body">Quiz: {this.props.selectedQuiz}</div>
                    <div className="form-group">
                        <input
                            style={{ width: "95%", marginLeft: "10px" }}
                            type="password" className="form-control"
                            id="email"
                            placeholder="Enter Proctoring Key"
                            name="enteredProctoringKey"
                            value={this.state.enteredProctoringKey}
                            onChange={this.handleChange}
                        />
                    </div>
                    <button onClick={this.verifyKey} style={{ marginBottom: "10px", marginLeft: "10px" }} type="submit" className="btn btn-success btns">SUBMIT</button>
                    <button onClick={this.props.changeState} style={{ marginBottom: "10px", marginLeft: "10px" }} type="submit" className="btn btn-info btns">BACK</button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.renderProctoringKey && this.renderProctoringKey()}
                {this.state.startQuiz && this.renderQuiz()}
                {this.state.renderResult && this.renderResult()}
            </div>
        )
    }
}

export default QuizHub;