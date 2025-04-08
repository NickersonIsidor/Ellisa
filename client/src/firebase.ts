// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyAuLWslQAbyHothhJFogM_wXJVyuETUYD4',
  authDomain: 'fakestackoverflow-ba1e1.firebaseapp.com',
  projectId: 'fakestackoverflow-ba1e1',
  storageBucket: 'fakestackoverflow-ba1e1.firebasestorage.app',
  messagingSenderId: '972848635328',
  appId: '1:972848635328:web:2d5c1791fb5b0bd112bc25',
  measurementId: 'G-E4V0HTJZBB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
