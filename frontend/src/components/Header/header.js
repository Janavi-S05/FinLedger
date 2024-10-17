import React, { useEffect } from 'react'
import './header.css';
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading])
  const logout = () => {
    try{
      signOut(auth)
      .then(()=>{
        toast.success('Logged out');
        navigate("/");
      }).catch((error)=>{
        toast.error(error.message);
      });
      alert("logOut");
    }
    catch(e){
      toast.error(e.message);
    }
  }
  return (
    <div className='navbar'>
      <p className='logo'>CashGuard</p>
      { user &&
        <div style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
          <img src={user.photoURL? user.photoURL: userImg} style={{height:"2rem", width:"2rem", borderRadius:"50%"}}/>
        <p className='logo link' onClick={logout}>LogOut</p>
        </div>
      }
    </div>
  )
}
export default Header; 