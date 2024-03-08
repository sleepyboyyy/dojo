import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAkgNIO5CdsgjNy_m_AFfKKhY7Clv0uGoU",
    authDomain: "dojo-6c086.firebaseapp.com",
    projectId: "dojo-6c086",
    storageBucket: "dojo-6c086.appspot.com",
    messagingSenderId: "155203438100",
    appId: "1:155203438100:web:7e482ad821bcec7da08901"
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp }