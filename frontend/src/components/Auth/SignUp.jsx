import React, { useState } from 'react'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        makePostCall(cred.user)
      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className='sign-up-container'>
      <form onSubmit={signUp}>
        <h1>Create an Account</h1>
        <input 
          type='email' 
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input 
          type='password' 
          placeholder='Enter your password' 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

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

export default SignUp