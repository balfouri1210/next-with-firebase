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
import firebaseConfig from '../config/env';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = firebaseAnalytics.getAnalytics(app);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(); // 현재 로그인한 사용자 return
export { signInWithPopup, signOut } from 'firebase/auth';

export const db = getFirestore();

export const storage = getStorage();

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
    updatedAt: data.createdAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis;