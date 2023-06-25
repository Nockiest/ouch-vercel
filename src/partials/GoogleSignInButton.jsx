import { useState } from "react";
 
import  "./GoogleButton.css";

const GoogleButton = ({ onClick }) => {
  return (
    <div
      // style={mergedButtonStyles}
      className="button g-sign-in-button"
      onClick={onClick}
    >
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />
        </div>
        <span className="text-container">Sign in with Google</span>
      </div>
    </div>
  );
};

export default GoogleButton;
