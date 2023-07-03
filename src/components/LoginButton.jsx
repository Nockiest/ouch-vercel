import GoogleButton from "../partials/GoogleSignInButton";
import React, { useState } from "react";
import { signInWithGoogle, auth } from "../firebase";
import "./loginButton.css";
export default function LoginButton({user, setUser} ) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignInWithGoogle = async () => {
      try {
        const result = await signInWithGoogle();
        console.log(result)
        const { displayName, photoURL, email } = result.user;

        setUser({ displayName, photoURL, email });
      } catch (error) {
        setErrorMessage(`Error signing in with Google. ${error}`);
      }
    };

    const handleSignOut = async () => {
      try {
        localStorage.clear();  
        window.location.reload();
        await auth.signOut();
      } catch (error) {
        // Handle sign out error
        console.error('Error signing out:', error);
      }
    };
    const logoutButtonStyles = {
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: '5px',
      padding: '10px 20px',
      border: 'none',
      cursor: 'pointer',
    };
    const logginTextStyles = { 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto",
      width: "fit-content",
      padding: "10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "5px",
      marginTop: "10px",
      transition:" background-color 0.3s",
    }
  return (
    <div className="loginSecttion">
  
      {!user ? (
        <div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <GoogleButton onClick={handleSignInWithGoogle}/>
        </div>
      ) : (
        <button className="log-out-btn btn" onClick={handleSignOut}
        style={logoutButtonStyles} >
          Log Out
        </button>
      )}
      
       {user && (
        <p className="logged-in-text" style={logginTextStyles}>
          Logged in as: {user.displayName}
        </p>
      )}
      
       
    </div>
  );
}