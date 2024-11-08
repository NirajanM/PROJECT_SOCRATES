// src/services/authService.js
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Sign Up
export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Log In
export const logIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Log Out
export const logOut = async () => {
  return await signOut(auth);
};
