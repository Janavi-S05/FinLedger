import React from 'react'
import '../../index.css';
import Input from '../Input/input';
import { useState } from 'react';
import Button from '../Button/button';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword ,signInWithPopup} from 'firebase/auth';
import { auth, db , provider} from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState("");
  const navigate = useNavigate();

  const createDoc = async (user) => {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Doc created");
        setLoading(false);
      }
      catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
    else {
      toast.error('Doc already exists');
      setLoading(false);
    }
  }

  const logIn = () => {
    console.log("Email: ", email);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success('User logged in');
          setLoading(false);
          navigate('/');
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(error.message);
          setLoading(false);
        });
    }
    else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  const signUp = () => {
    setLoading(true);
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User ", user);
            toast.success('User created');
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate('/dashboard');
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      }
      else {
        toast.error("Password doesn't match");
        setLoading(false);
      }
    }
    else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  let popupInProgress = false;
  const googleAuth = async() => {
    if (popupInProgress) return;  
    popupInProgress = true; 
    setLoading(true);
    try{
        const result = await signInWithPopup(auth, provider);      
        const user = result.user;
        console.log('User: ',user);
        await createDoc(user);
        toast.success('User authenticated');
        navigate('/dashboard');
      }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(error.message)
      }finally{
        setLoading(false);
        popupInProgress=false;
      }
  }
  return (
    <>
      {loginForm ? (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login on <span style={{ color: "var(--theme)" }}>CashGuard</span>
          </h2>
          <form>
            <Input label={"Email"} state={email} setState={setEmail} placeholder={"Enter your email"} type="emaail" />
            <Input label={"Password"} state={password} setState={setPassword} placeholder={"Enter your password"} type="password" />
            <Button disabled={loading} text={loading ? "loading..." : "LogIn"} onClick={logIn} />
            <p style={{ textAlign: "center", margin: 0 }}>Or</p>
            <Button text={loading ? "loading..." : "Google LogIn"} blue={true} onClick={googleAuth}/>
            <p className='login' style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>Or Don't have an Account? Click Here</p>
          </form>
        </div>) :
        <div className='signup-wrapper'>
          <h2 className='title'>
            SignUp on <span style={{ color: "var(--theme)" }}>CashGuard</span>
          </h2>
          <form>
            <Input label={"Full Name"} state={name} setState={setName} placeholder={"Enter your name"} type="name" />
            <Input label={"Email"} state={email} setState={setEmail} placeholder={"Enter your email"} type="emaail" />
            <Input label={"Password"} state={password} setState={setPassword} placeholder={"Enter your password"} type="password" />
            <Input label={"Confirm Password"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Confirm the Password"} type="password" />
            <Button disabled={loading} text={loading ? "loading..." : "SignUp"} onClick={signUp} />
            <p style={{ textAlign: "center", margin: 0 }}>Or</p>
            <Button text={loading ? "loading..." : "Google SignUp"} blue={true}  onClick={googleAuth}/>
            <p className='login' style={{ cursor: "pointer" }} onClick={() => setLoginForm(!loginForm)}>
              Or Have an account? Click Here
            </p>
          </form>
        </div>
      }
    </>
  )
}

export default SignUp;