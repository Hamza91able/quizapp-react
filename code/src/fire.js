import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDwQy6WCPHD2tZ6Dux7LTGOLKcFoE2btE4",
    authDomain: "quizapp-69b93.firebaseapp.com",
    databaseURL: "https://quizapp-69b93.firebaseio.com",
    projectId: "quizapp-69b93",
    storageBucket: "quizapp-69b93.appspot.com",
    messagingSenderId: "846974210600"
};
var fire = firebase.initializeApp(config);

export default fire;