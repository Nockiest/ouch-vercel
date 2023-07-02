import React, { useEffect, useState } from "react";
import "./gallery.css";
import { downloadURLFinder, colRef, db,  storage } from "../firebase";
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ref,deleteObject } from "firebase/storage";
import { onSnapshot, doc, deleteDoc } from "firebase/firestore";
import SearchBar from "./SearchBar";
import deleteLeftIcon from "../svg/delete-left-solid.svg"
// library.add(fas);

const Gallery = ({ fetchImages,selectedCategory, selectedSubCategory,
  user,  storedImages, handleSubcategories, searchedTerm,
  handleSearch }) => {
  const displayNameWithoutSpaces = user.displayName.replace(/\s/g, '');
  const userCredentials = `${displayNameWithoutSpaces} ${user.email}`;
  const [downloadURL, setDownloadURL] = useState(null);
  const [postData, setPostData] = useState([])

  const extractNameAndCategory = (filename) => {
 
    const nameWithCategory = filename.split('.')[0];
    const parts = nameWithCategory.split('_');
 
    const name = parts[0].substring(parts[0].indexOf('/') + 1).replace(/%/g, ' ');
    const category = parts[1];
    const subcategory = parts[2]
    const header = parts[3] //parts.slice(3).join('_') + '.cz'; // Extract the part after "xyz"
    
    
    return { name, category, subcategory, header, filename };
  };
  // Filter the storedImages based on the searched term
  const filteredImages = storedImages.filter((image) => {
    // console.log(storedImages)
    const { name } = extractNameAndCategory(image.filename);
     return  name.toLowerCase().includes(searchedTerm.toLowerCase());
  });
  const filteredPosts = postData.filter((post) => {
    
  
    if (selectedCategory && selectedSubCategory) {
      return post.category === selectedCategory && post.subcategory === selectedSubCategory;
    } else if (selectedCategory) {
      return post.category === selectedCategory;
    } else if (selectedSubCategory) {
      return post.subcategory === selectedSubCategory;
    }
  
    return true; // Return all posts if no category or subcategory is selected
  });
  
  const addDescriptionToImage = (imageName) => {
    const trimmedFilename = imageName.replace(/^.+\//, '')
    const post = filteredPosts.find((post) => post.imgName === trimmedFilename);
    return post ? post.description : '';
  };
  const handleImageClick = async (downloadURL) => {
    try {
      const response = await fetch(`/download?downloadURL=${encodeURIComponent(downloadURL)}`);
    //  const response = downloadURLFinder(downloadURL)
      // console.log(response)
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadURL(url); // Store the download URL in state
        // console.log(downloadURL)
      } else {
        console.error('File download failed.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
 
  const handleDelete = async (image) => {
    // Find the post in the post list
    console.log(image)
    const trimmedFilename = image.filename.replace(/^.+\//, '');
    console.log(trimmedFilename, postData)
    const postToDelete = postData.find((post) => post.imgName ===trimmedFilename);
     console.log(postToDelete, "XYZ")
    // If the post has an associated image, delete it from Firebase Storage
    if (postToDelete) {
      try {
        const imageRef = ref(storage, `files/${trimmedFilename}`);
        // console.log(imageRef, "img")
        await deleteObject(imageRef);
         
        console.log(`Image ${trimmedFilename} deleted successfully.`);
        
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  
    // Remove the post from the post list
    setPostData((prevPostList) =>
      prevPostList.filter((post) => post.id !== image.id)
    );
  
    try {
      // Delete the post from Firestore
      const postRef = doc(db, 'files', postToDelete.id);
      await deleteDoc(postRef);
      console.log('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    fetchImages()
  };

  useEffect(() => {
    // Fetch postData from Firebase database
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const postDataArray = snapshot.docs.map((doc) => {
        const postData = doc.data();
        const postId = doc.id;
        return { id: postId, ...postData };
      });
      console.log(postDataArray);
      setPostData(postDataArray);
    });
  
    return () => {
      // Unsubscribe from Firebase snapshot listener when component unmounts
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    // Extract unique categories from the postData
    handleSubcategories(postData, "subcategory")
    handleSubcategories(postData, "category")
  }, [postData]);

  useEffect(() => {
    // Clear the download URL when the component unmounts
    return () => {
      URL.revokeObjectURL(downloadURL);
    };
  }, [downloadURL]);
  return (
    <div className="gallery-section">
      <SearchBar handleSearch={handleSearch} />
      <h2>Gallery</h2>
      
      <div className="gallery">
        {filteredImages.map((image) => {
          const { name, category, subcategory, header,filename } = extractNameAndCategory(image.filename);
          const description = addDescriptionToImage(image.filename);
        console.log(  header === "OndřejLukeš", header)
          // console.log(  userCredentials.replace(/\s/g, '') ===  header.replace(/\s/g, ''),  userCredentials.replace(/\s/g, '') , header.replace(/\s/g, ''))
          
          return (
            // userCredentials.replace(/\s/g, '') ===  header.replace(/\s/g, '')
            header === "OndřejLukeš" &&  ( <div className="image-src" key={filename} onClick={() => handleImageClick(filename)}>
                <div className="image-item">
                  <img className="image" src={image.downloadURL} alt={filename} />
                </div>
                <div className="image-category">
                  <h4>Category: {category}</h4>
                  <h2 className="image-subCategory">Subcategory: {subcategory}</h2>
                </div>
                <h3 className="image-header">{name}</h3>
                {description && <p className="image-description">{description}</p>}
                {image.downloadURL && (
                  <div>
                    <a href={image.downloadURL} download>
                      Download Image
                    </a>
                  </div>
                )}
                <img className="search-icon" src={deleteLeftIcon}  style={{ color: 'red', fontSize: '24px' } }alt="SVG Image" onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  handleDelete(image);
                }} />
              </div>
            )
          );
        })}
      </div>
       
    </div>
  );
};

export default Gallery;

