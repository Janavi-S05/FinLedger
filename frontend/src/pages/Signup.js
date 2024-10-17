import React from 'react'
import Header from '../components/Header/header';
import SignUp from '../components/SignUp/signup';
import '../App.css';
export default function Signup() {
  return (
    <div>
      <Header/>
      <div className='wrapper'>
      <SignUp/>
      </div>
    </div>
  )
}
