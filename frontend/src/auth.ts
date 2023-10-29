import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  signin(username: string, password: string): Promise<void>;
  signout(): Promise<void>;
  signup(username: string, password: string);
}

export const AuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  async signin(username: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      AuthProvider.isAuthenticated = true;
      AuthProvider.username = username;
    } catch (error) {
      console.log(error);
    }
  },
  async signout() {
    await signOut(auth);
    AuthProvider.isAuthenticated = false;
    AuthProvider.username = "";
  },
  signup(username: string, password: string) {
    return  signInWithEmailAndPassword(auth, username, password)
  },
};

async function makePostCall(user) {
  try {
    const newUser = {
      uid: user.uid,
      email: user.email
    }
    await axios.post('http://localhost:8000/user', newUser)
  } catch (error) {
    console.log(error);
  }
} 