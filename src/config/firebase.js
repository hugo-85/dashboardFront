import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const env_apiKey = process.env.REACT_APP_APIKEY;
const env_authDomain = process.env.REACT_APP_AUTHDOMAIN;
const env_databaseURL = process.env.REACT_APP_DATABASEURL;
const env_projectId = process.env.REACT_APP_PROJECTID;
const env_storageBucket = process.env.REACT_APP_STORAGEBUCKET;
const env_messagingSenderId = process.env.REACT_APP_MESSAGINGSENDERID;
const env_appId = process.env.REACT_APP_APPID;

var firebaseConfig = {
  apiKey: String(env_apiKey),
  authDomain: String(env_authDomain),
  databaseURL: String(env_databaseURL),
  projectId: String(env_projectId),
  storageBucket: String(env_storageBucket),
  messagingSenderId: String(env_messagingSenderId),
  appId: String(env_appId),
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db_firestore = firebase.firestore();
export const db_realtime = firebase.database().ref();
export const storage = firebase.storage();

export default firebase;
