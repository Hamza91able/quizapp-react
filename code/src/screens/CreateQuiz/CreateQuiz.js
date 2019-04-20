import React, { Component } from 'react';
import firebase from '../../fire';
import './CreateQuiz.css'
import swal from 'sweetalert';

class CreateQuiz extends Component {
    constructor() {
        super();
        this.state = {
            SelectedCourse: '',
            newQuiz: '',
            quizTitle: '',
            quizDuration: '',
            totalQuestions: '',
            passingScore: '',
            proctoringKey: '',
            renderGeneralInfo: true,
            renderCreateQuestions: false,
            renderFinsish: false,
            renderCancel: false,
            disableButton: true,
            questionNo: 1,
            questionWritten: false,
            Questions: [],
            checkedAns: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.createQuestions = this.createQuestions.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    componentDidMount() {
        this.getInitialQuizInfo();
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    getInitialQuizInfo() {
        const newSelectedCourse = this.props.newSelectedCourse;
        let array = [];
        if (newSelectedCourse !== undefined) {
            const firebaseRef = firebase.database().ref("Quizes").child(newSelectedCourse);
            firebaseRef.on('child_added', snap => {
                array.push(snap.ref.path.pieces_[2].split(" ")[1]);
                var max = 0;
                var a = array.length;
                for (var counter = 0; counter < a; counter++) {
                    if (array[counter] > max) {
                        max = array[counter];
                    }
                }
                let newQuiz
                if (this.state.checkedAns === "") {
                    newQuiz = parseInt(max) + 1
                } else {
                    newQuiz = this.state.newQuiz;
                }
                const quizTitle = newSelectedCourse + ' Quiz ' + newQuiz;
                this.setState({
                    newQuiz: newQuiz,
                    quizTitle: quizTitle
                })
            })
        }
    }

    renderSelectedCourse() {
        return (
            <div className="panel-group user-loggedin">
                <div className="panel panel-primary">
                    <div className="panel-heading">Course Information</div>
                    <div className="panel-body">{"Selected Course: " + this.props.newSelectedCourse}</div>
                    <div className="panel-body">Quiz No: Quiz {this.state.newQuiz}</div>
                </div>
            </div>
        )
    }

    changeState() {
        this.setState({
            renderGeneralInfo: false,
            renderCreateQuestions: true,
        })
    }

    nextQuestion() {
        var answer = "";
        if (this.state.checkedAns === "1") {
            answer = this.text1.value;
        }
        else if (this.state.checkedAns === "2") {
            answer = this.text2.value;
        }
        else if (this.state.checkedAns === "3") {
            answer = this.text3.value;
        }
        else if (this.state.checkedAns === "4") {
            answer = this.text4.value;
        }
        else {
            console.log("An error occured");
        }
        const { questionNo, totalQuestions } = this.state;
        if (questionNo <= totalQuestions) {
            var quesNo = "Q" + questionNo;
            this.setState({
                questionNo: questionNo + 1,
                disableButton: true,
            })
            const newSelectedCourse = this.props.newSelectedCourse;
            const { newQuiz, passingScore, proctoringKey, quizDuration, quizTitle, totalQuestions } = this.state;
            const firebaseRef = firebase.database().ref("Quizes").child(newSelectedCourse).child("Quiz " + newQuiz).child("Questions").child(quesNo);
            const firebaseRef2 = firebase.database().ref("Quizes").child(newSelectedCourse).child("Quiz " + newQuiz);
            firebaseRef.set({
                Answer: answer,
                Choice_1: this.text1.value,
                Choice_2: this.text2.value,
                Choice_3: this.text3.value,
                Choice_4: this.text4.value,
                Question: this.question.value,
            }).then(() => {
                firebaseRef2.update({
                    "Passing Score": passingScore,
                    "Proctoring Key": proctoringKey,
                    "Quiz Duration": quizDuration,
                    "Quiz Title": quizTitle,
                    "Total Questions": totalQuestions,
                })
            })
        }
        else {
            console.log("Questions Finished");
        }

        this.opt1.checked = false;
        this.opt2.checked = false;
        this.opt3.checked = false;
        this.opt4.checked = false;
        this.text1.value = "";
        this.text2.value = "";
        this.text3.value = "";
        this.text4.value = "";
        this.question.value = "";
    }

    cancelQuiz() {
        swal({
            title: "Are you sure?",
            text: "Are you sure you want to cancel the quiz creation.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Quiz creation cancelled!", {
                        icon: "success",
                    });
                    const newSelectedCourse = this.props.newSelectedCourse;
                    const firebaseRef = firebase.database().ref("Quizes").child(newSelectedCourse).child("Quiz " + this.state.newQuiz);
                    firebaseRef.remove();
                    this.setState({
                        renderCancel: true,
                        renderCreateQuestions: false,
                    })
                }
            });
    }

    createQuestions() {
        const { questionNo, totalQuestions } = this.state;
        if (questionNo > totalQuestions) {
            console.log("Quiz Finished");
            this.setState({
                renderCreateQuestions: false,
                renderFinsish: true,
            })
        }
        return (
            <div className="panel-group quiz-list">
                <div className="panel panel-primary">
                    <div className="panel-heading">Questions</div>
                    <div className="form-group question-div">
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="comment">Q{this.state.questionNo}</label>
                                <textarea ref={textarea => { this.question = textarea }} className="form-control" onKeyUp={() => this.setState(this.value !== "" && { questionWritten: true })} rows="5" id="comment"></textarea>
                            </div>
                            <div className="alert alert-warning">
                                <strong>Info!</strong> Check the correct choice to set it as answer
                            </div>
                            <div className="radio">
                                <label><input ref={input => { this.opt1 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, checkedAns: "1" }) }} name="optradio" /><input ref={input => { this.text1 = input }} type="text" className="form-control" /></label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt2 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, checkedAns: "2" }) }} name="optradio" /><input ref={input => { this.text2 = input }} type="text" className="form-control" /></label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt3 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, checkedAns: "3" }) }} name="optradio" /><input ref={input => { this.text3 = input }} type="text" className="form-control" /></label>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="radio">
                                <label><input ref={input => { this.opt4 = input }} type="radio" onChange={() => { this.setState({ disableButton: false, checkedAns: "4" }) }} name="optradio" /><input ref={input => { this.text4 = input }} type="text" className="form-control" /></label>
                                <button className="btn btn-info" onClick={() => { this.nextQuestion(); }} disabled={this.state.disableButton && this.state.questionWritten} style={{ float: "right", marginTop: "15px" }}>NEXT QUESTION</button>
                                <button className="btn btn-danger" onClick={() => { this.cancelQuiz(); }} style={{ float: "right", marginTop: "15px", marginRight: "15px" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderFinish() {
        return (
            <div className="panel-group quiz-list">
                <div className="panel panel-primary">
                    <div className="panel-heading">Finish</div>
                    <div className="form-group question-div">
                        <div className="panel-body">
                            <div className="alert alert-success">
                                <strong>Success!</strong> Quiz Created Succesfully.
                                <button className="btn btn-success" onClick={() => this.props.endQuizMaker()} style={{ float: "right" }}>FINISH</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderCancelFinish() {
        return (
            <div className="panel-group quiz-list">
                <div className="panel panel-primary">
                    <div className="panel-heading">Finish</div>
                    <div className="form-group question-div">
                        <div className="panel-body">
                            <div className="alert alert-danger">
                                <strong>Info!</strong> Quiz Creation Cancelled
                                <button className="btn btn-danger" onClick={() => this.props.endQuizMaker()} style={{ float: "right" }}>FINISH</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderGeneralInfo() {
        const newSelectedCourse = this.props.newSelectedCourse;
        return (
            <div className="panel-group gen-info">
                <div className="panel panel-info">
                    <div className="panel-heading">General Information</div>
                    <div className="panel-body">
                        <div className="form-group">
                            <label htmlFor="usr">Quiz Title:</label>
                            <input type="text"
                                name="quizTitle"
                                disabled={true}
                                value={newSelectedCourse + ' Quiz ' + this.state.newQuiz}
                                className="form-control" id="usr" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usr">Quiz Duration (In Minutes):</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quizDuration"
                                value={this.state.quizDuration}
                                onChange={this.handleChange}
                                id="usr" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usr">Total Questions:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="totalQuestions"
                                value={this.state.totalQuestions}
                                onChange={this.handleChange}
                                id="usr" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usr">Passing Score (In Percentage):</label>
                            <input
                                type="number"
                                className="form-control"
                                name="passingScore"
                                value={this.state.passingScore}
                                onChange={this.handleChange}
                                id="usr" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="usr">Proctoring Key:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="proctoringKey"
                                value={this.state.proctoringKey}
                                onChange={this.handleChange}
                                id="usr" />
                        </div>
                        <div className="form-group">
                            <button onClick={this.changeState} className="btn btn-info" style={{ float: "right" }}>NEXT</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderSelectedCourse()}
                {this.state.renderGeneralInfo && this.renderGeneralInfo()}
                {this.state.renderCreateQuestions && this.createQuestions()}
                {this.state.renderFinsish && this.renderFinish()}
                {this.state.renderCancel && this.renderCancelFinish()}
            </div>
        )
    }

}

export default CreateQuiz;