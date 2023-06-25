

import React, { useState } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// import firebaseConfig from './firebase';

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const auth = getAuth();
 

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleSignUp = () => {
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // User signed up successfully
  //       const user = userCredential.user;
  //       console.log('Signed up:', user);
  //     })
  //     .catch((error) => {
  //       // Handle sign up error
  //       console.log('Sign up error:', error);
  //     });
  // };

  // const handleSignIn = () => {
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // User signed in successfully
  //       const user = userCredential.user;
  //       console.log('Signed in:', user);
  //     })
  //     .catch((error) => {
  //       // Handle sign in error
  //       console.log('Sign in error:', error);
  //     });
  // };

  // const handleSignOut = () => {
  //   signOut(auth)
  //     .then(() => {
  //       // User signed out successfully
  //       console.log('Signed out');
  //     })
  //     .catch((error) => {
  //       // Handle sign out error
  //       console.log('Sign out error:', error);
  //     });
  // };

  return (
    <div>
      {/* <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button> */}
    </div>
  );
};

export default AuthComponent;
