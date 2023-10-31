import React, { useState } from "react";
import "./LoginPage.css"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("signed in");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <div className="LoginPage">
      <div className="auth-form-container">
        <h1 margin="0">Broke Blessings</h1>
        <form className="login-form" onSubmit={signIn}>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>
          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" id="password" name="password"/>
          <div><button type="submit">Log In</button></div>
        </form>
        <Link to="/signup"><button>Don't have an account? Register here</button></Link>
      </div>
    </div>
  )
}

export default LoginPage;
