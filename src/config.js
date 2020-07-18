import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyBnvwdb3Y1MEtVvYHbJgQ4VR2Jgyt9zwd4',
  authDomain: 'hutech-conf.firebaseapp.com',
  databaseURL: 'https://hutech-conf.firebaseio.com',
  projectId: 'hutech-conf',
  storageBucket: 'hutech-conf.appspot.com',
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
}

firebase.initializeApp(config)

export const db = firebase.firestore()

export const realtimeDB = firebase.database()

export const storage = firebase.storage()

export default firebase
