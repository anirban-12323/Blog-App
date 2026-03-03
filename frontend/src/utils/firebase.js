// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIxhhSjgO8TGtod04tEBR5rOYdbLs0dI0",
  authDomain: "blog-app-f9c1d.firebaseapp.com",
  projectId: "blog-app-f9c1d",
  storageBucket: "blog-app-f9c1d.firebasestorage.app",
  messagingSenderId: "754232792189",
  appId: "1:754232792189:web:c237f3916106a5c16c0d14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function googleAuth() {
  try {
    let data = await signInWithPopup(auth, provider);
    return data.user;
  } catch (error) {
    console.log(error);
  }
}
