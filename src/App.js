import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Gallery from './components/Gallery';
import "./App.css"
import FileSendingForm from './components/Filesendingform';
import SearchBar from './components/SearchBar';
import LoginButton from './components/LoginButton';
import Navbar from './components/Navbar';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Categories from './components/Categories';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
 import { storage, colRef } from './firebase';
import {serverTimestamp, addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [storedImages, setStoredImages] = useState([]);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  useEffect(() => {
    fetchImages();
    const storedUserName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedUserName && storedProfilePic && storedEmail) {
      setUser({ displayName: storedUserName, photoURL: storedProfilePic, email: storedEmail });
    }
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
      const uploadFile = async (formData) => { // Add 'async' here
      //  console.log(user);
        const { filename, user, description, category, subcategory,imageUpload } = formData;
        const augmentedCategory = category || "default";
     console.log(user)
        const imgName = `${filename}_${augmentedCategory}_${subcategory}_${user}_${uuidv4()}`;
        console.log(imgName);
        const filesRef = ref(storage, `files/${imgName}`);
  
        await uploadBytes(filesRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
          });
        });
        await addDoc(colRef, { // Add 'await' here
          imgName,
          user,
          timeStamp: serverTimestamp(),
          description,
          category,
          subcategory
        });
      };
      await uploadFile(formData); // Add 'await' here
  
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

  const handleSubcategories = (postData, type) => {
    // Extract unique categories or subcategories from the postData
    const extractedItems = postData.map((post) => post[type]);
    const uniqueItems = extractedItems.filter(
      (item, index, array) => item && array.indexOf(item) === index
    );
    
    console.log(uniqueItems);
  
    if (type === 'subcategory') {
      setSubCategories(uniqueItems);
    } else if (type === 'category') {
      setCategories(uniqueItems);
    }
  };
  return (
    <div>
      <Navbar  user={user} setUser={setUser} handleSearch={handleSearch}/> 
      {user && 
      <>
         
      <section className='main'>
        
        
         
          <div className='left-bar'>
          <FileSendingForm 
          user={user}
          onFileUpload={handleFileUpload}
          />
          <Categories
            setSelectedCategory={setSelectedCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            selectedCategory={selectedCategory}
            selectedSubCategory={ selectedSubCategory}
            categories={categories}
            subCategories={subCategories}
          />
        </div>
         
      <Gallery  
       selectedCategory={selectedCategory}
       selectedSubCategory={selectedSubCategory}
       fetchImages={fetchImages} 
       user={user}
       storedImages={storedImages}
       searchedTerm={searchedTerm}
       handleSubcategories={handleSubcategories}
       handleSearch={handleSearch}
        />
      </section>
      </>
      }
    
    </div> 
  );
};

export default App;


    // const response = await axios.post('/add', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })