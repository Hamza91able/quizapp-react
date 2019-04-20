import React, { Component } from 'react';
import './App.css';
import Login from './screens/Login/Login'
// import Register from './screens/Register/Register'
import Dashboard from './screens/Dashboard/Dashboard'
import CourseDetails from './screens/CourseDetails/CourseDetails';
import QuizHub from './screens/QuizHub/QuizHub';
import Navbar from './screens/Navbar/Navbar';
import Regiser from './screens/Register/Register';
import CreateQuiz from './screens/CreateQuiz/CreateQuiz';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      showDashBoard: false,
      showCourseDetails: false,
      showLogin: true,
      showRegister: false,
      showQuizHub: false,
      showQuizMaker: false,
      selectedQuiz: "",
      quizTitle: "",
      selectedQuizNo: "",
      quizDuration: "",
      totalQuestions: "",
      onCreateQuiz: false,
      quizStart: false,
    }
  }

  showCourseDetails(value) {
    this.setState({
      showDashBoard: false,
      showCourseDetails: true,
      selectedQuiz: value,
    })
  }

  hideCourseDetails() {
    this.setState({
      showDashBoard: true,
      showCourseDetails: false,
    })
  }

  changeLoggedInState() {
    this.setState({
      isLoggedIn: true,
      showRegister: false,
      showDashBoard: true,
    })
  }

  showRegister() {
    this.setState({
      showRegister: true,
      showLogin: false,
    })
  }

  showLogin() {
    this.setState({
      showRegister: false,
      showLogin: true,
    })
  }

  startQuiz(quizTitle, selectedQuizNo, quizDuration, totalQuestions) {
    this.setState({
      showQuizHub: true,
      showCourseDetails: false,
      quizTitle: quizTitle,
      selectedQuizNo: selectedQuizNo,
      quizDuration: quizDuration,
      totalQuestions: totalQuestions,
      quizStart: true,
    })
  }

  exitQuiz() {
    this.setState({
      showQuizHub: false,
      showCourseDetails: false,
      showDashBoard: true,
      quizStart: false,
    })
  }

  logOut() {
    this.setState({
      isLoggedIn: false,
      showLogin: true,
      showDashBoard: false,
    })
  }

  setSelectedCourse(value) {
    this.setState({
      newSelectedCourse: value,
      showDashBoard: false,
      showCourseDetails: false,
      showQuizMaker: true,
      onCreateQuiz: true,
    })
  }

  endQuizMaker() {
    this.setState({
      showQuizMaker: false,
      showDashBoard: true,
      onCreateQuiz: false,
    })
  }

  showDashBoard() {
    this.setState({
      showDashBoard: true,
      showCourseDetails: false,
      showQuizMaker: false,
      onCreateQuiz: false,
    })
  }

  render() {
    return (
      <div>
        <Navbar quizStart={this.state.quizStart} onCreateQuiz={this.state.onCreateQuiz} showDashBoard={this.showDashBoard.bind(this)} selectedCourse={this.setSelectedCourse.bind(this)} logOut={this.logOut.bind(this)} changeLoggedInState={this.showRegister.bind(this)} showLogin={this.showLogin.bind(this)} isLoggedIn={this.state.isLoggedIn} />
        {!this.state.isLoggedIn && this.state.showLogin && <Login changeLoggedInState={this.changeLoggedInState.bind(this)} />}
        {this.state.showRegister && <Regiser changeLoggedInState={this.changeLoggedInState.bind(this)} />}
        {this.state.showDashBoard && this.state.isLoggedIn && <Dashboard changeState={this.showCourseDetails.bind(this)} />}
        {this.state.showCourseDetails && <CourseDetails changeState={this.hideCourseDetails.bind(this)} startQuiz={this.startQuiz.bind(this)} selectedQuiz={this.state.selectedQuiz} />}
        {this.state.showQuizHub && <QuizHub changeState={this.exitQuiz.bind(this)} selectedQuiz={this.state.quizTitle} selectedQuizNo={this.state.selectedQuizNo} quizTitle={this.state.selectedQuiz} quizDuration={this.state.quizDuration} totalQuestions={this.state.totalQuestions} />}
        {this.state.showQuizMaker && <CreateQuiz endQuizMaker={this.endQuizMaker.bind(this)} newSelectedCourse={this.state.newSelectedCourse} />}
      </div>
    );
  }
}

export default App;