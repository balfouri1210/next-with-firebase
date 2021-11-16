// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import * as firebaseAnalytics from 'firebase/analytics';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  limit,
  Timestamp
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB1KqJ4g5gF4XNI87t-iaYaf_su8pCZxMo',
  authDomain: 'mute-48b06.firebaseapp.com',
  projectId: 'mute-48b06',
  storageBucket: 'mute-48b06.appspot.com',
  messagingSenderId: '898197776493',
  appId: '1:898197776493:web:270910e88a09638aef7764',
  measurementId: 'G-NBHBFBQCDZ'
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = firebaseAnalytics.getAnalytics(app);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth();
export { signInWithPopup, signOut } from 'firebase/auth';

export const db = getFirestore();

export async function getUserWithUsername(username: string) {
  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef, where('username', '==', username), limit(1));
  const userDoc = await getDocs(userQuery);

  return userDoc.docs[0];
}

export async function getPosts(uid: string) {
  const postRef = collection(db, 'users', uid, 'posts');
  const postQuery = query(postRef, where('published', '==', true), limit(5));
  const postDocs = await getDocs(postQuery);

  return postDocs.docs.map(postToJSON);
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis;