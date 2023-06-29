import React from 'react';
import LoginButton from './LoginButton';
import SearchBar from './SearchBar';
import cloudIcon from '../svg/cloud.svg';
import "./Navbar.css"

const Navbar = ({ user, setUser }) => {
  return (
    <nav className="navbar">
     <img src={cloudIcon} alt="SVG Image" />
      <h1>Ondřejův mrak</h1> 
      <div> 
    
      <LoginButton user={user} setUser={setUser} />
      </div>
       
    </nav>
  );
};

export default Navbar;



 