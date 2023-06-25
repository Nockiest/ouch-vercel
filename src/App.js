import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';
import FileSendingForm from './components/FileSendingForm';
import SearchBar from './components/SearchBar';
import LoginButton from './components/LoginButton';
import AuthComponent from './Authentication';
const App = () => {
  const [storedImages, setStoredImages] = useState([]);
  const [searchedTerm, setSearchedTerm] = useState('');
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch('/gallery')
      .then((response) => response.json())
      .then((data) => {
        const images = data.map((file) => ({
          filename: file.filename,
          downloadURL: file.downloadURL,
        }));
        setStoredImages(images);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  };

  const handleFileUpload = async (formData) => {
    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await axios.post('/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('File upload response:', response.data);
      fetchImages(); // Fetch images again after successful upload
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle the error, display an error message, etc.
    }
  };
  const handleSearch = (term) => {
    const trimmedTerm = term.trim(); // Trim leading and trailing white spaces
  
    // If the trimmed term is only white spaces, set it to an empty string
    const finalTerm = trimmedTerm.length === 0 ? "" : trimmedTerm;
  
    setSearchedTerm(finalTerm);
    console.log(finalTerm);
  };
  return (
    <div>
      <h1>My App</h1>
      <LoginButton />
      {/* <AuthComponent /> */}
      <p>{searchedTerm}</p>
      <FileSendingForm onFileUpload={handleFileUpload} />
      <SearchBar onSearch={handleSearch} />
      <Gallery storedImages={storedImages} searchedTerm={searchedTerm} />
    
    </div> 
  );
};

export default App;
