import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore,doc,setDoc} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZFNgixEgqHtFbQVuOVTYJKV97zYgf_wo",
  authDomain: "finance-tracker-1d40e.firebaseapp.com",
  projectId: "finance-tracker-1d40e",
  storageBucket: "finance-tracker-1d40e.appspot.com",
  messagingSenderId: "948352894997",
  appId: "1:948352894997:web:fca077e05732519a1e261c",
  measurementId: "G-BCR2KGMVWH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};