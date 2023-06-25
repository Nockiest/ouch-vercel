import React from 'react';
import LoginButton from './LoginButton';
import "./Navbar.css"

const Navbar = ({ user, setUser }) => {
  return (
    <nav className="navbar">
     <h1>logo</h1>
      <h1>Ondřejův mrak</h1>
      <LoginButton user={user} setUser={setUser} />
    </nav>
  );
};

export default Navbar;




{/* <li> */}
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/gallery">Gallery</Link>
//         </li>
//         <li>
//           <Link to="/about">About</Link>
//         </li>