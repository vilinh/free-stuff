import React, { useState } from "react";
import "./LoginPage.css"

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    // TODO: Add login request
  }

  return (
    <div className="LoginPage">
      <div className="auth-form-container">
        <h1 margin="0">Broke Blessings</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>
          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" id="password" name="password"/>
          <div><button type="submit">Log In</button></div>
        </form>
        <button>Don't have an account? Register here</button>
      </div>
    </div>
  )
}

export default LoginPage;
