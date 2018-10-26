import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyC_Q7AhrAO-1baHMzwS0Ivp9zUVwQ9v8CE",
    authDomain: "test-57147.firebaseapp.com",
    databaseURL: "https://test-57147.firebaseio.com",
    projectId: "test-57147",
    storageBucket: "test-57147.appspot.com",
    messagingSenderId: "812626537285"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(config)
}
else{
    firebase.app();
}
export default firebase;
