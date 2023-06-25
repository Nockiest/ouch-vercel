import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';
import FileSendingForm from './components/FileSendingForm';
import SearchBar from './components/SearchBar';
import LoginButton from './components/LoginButton';
import Navbar from './components/Navbar';
import Categories from './components/Categories';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
 import { storage } from './firebase';
import {serverTimestamp, addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
const App = () => {
  const [storedImages, setStoredImages] = useState([]);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [imageUpload, setImageUpload] = useState("");
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
      // const response = await axios.post('/add', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
     
      const uploadFile = (formData) => {
        const { filename, user, description, category } = formData;
        const augmentedCategory = category || "default" 
          const imgName =  `${filename}_${augmentedCategory}_${user}_${uuidv4()}` ;
      //  const imgName = uuidv4()
        const filesRef = ref(storage, `files/${imgName}`);
      
        uploadBytes(filesRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
          });
        });
      };
      uploadFile(formData)
      // console.log('File upload response:', response.data);
      // fetchImages(); // Fetch images again after successful upload
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
      <Navbar  user={user} setUser={setUser}/>
  
    
      {user && 
      <div>
        <div>
          <p>{searchedTerm}</p>
          <FileSendingForm 
          user={user}
          onFileUpload={handleFileUpload}
          setImageUpload={setImageUpload} />
          <SearchBar onSearch={handleSearch} />
          <Categories
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            categories={categories}
          />

        </div>
      <Gallery  
       selectedCategory={selectedCategory}
        
       categories={categories} 
       setCategories={setCategories}
       user={user}
       storedImages={storedImages}
       searchedTerm={searchedTerm}
        />
      </div>
      }
    
    </div> 
  );
};

export default App;
