import React, { useState } from 'react';
import "./searchBar.css"
import searchIcon from "../svg/search.svg"
const SearchBar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value); // Call handleSearch with the updated value
  };

  return (
    <div   className="search-bar"> 
    <img className="search-icon" src={searchIcon} alt="SVG Image" />
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        // style={{ backgroundImage: `url(${searchIcon})`, backgroundPosition: 'left', backgroundRepeat: 'no-repeat' }}
      />
      </div>
  );
};

export default SearchBar;