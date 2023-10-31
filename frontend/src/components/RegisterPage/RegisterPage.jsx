import React, { useState } from "react";
import "./RegisterPage.css"

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email === "" || password === "" || confirmedPass === "" ||
       name === "" || username === "") {
        console.log("Form not complete case");
    }
    else if(password != confirmedPass){
        console.log("Passwords don't match case");
    } else {
        console.log("Passwords match");
    }
  }

  return (
    <div className="RegisterPage">
      <div className="auth-form-container">
        <h1>Registration</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor=""name>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Full Name" id="name" name="name"/>
          <label htmlFor=""name>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="Username" id="username" name="username"/>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email"/>
          <label htmlFor="password">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" id="password" name="password"/>
          <input value={confirmedPass} onChange={(e) => setConfirmedPass(e.target.value)} type="password" placeholder="Confirm Password" id="confirmedPassword" name="confirmedPassword"/>
          <div><button type="submit">Register</button></div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage;