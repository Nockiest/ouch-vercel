import React, { useEffect, useState } from "react";
import "./gallery.css";
import { downloadURLFinder, colRef, db,  storage } from "../firebase";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ref,deleteObject } from "firebase/storage";
import { onSnapshot, doc, deleteDoc } from "firebase/firestore";
import SearchBar from "./SearchBar";
library.add(fas);

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
    const header = parts.slice(3).join('_') + '.cz'; // Extract the part after "xyz"
    
    
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
          if (!description) {
            return null; // Skip rendering the image if it doesn't have a description
          }
          return (
            // userCredentials === header && 
            0 < 1 && (
              <div className="image-src" key={image.filename} onClick={() => handleImageClick(image.filename)}>
                <div className="image-item">
                  <img className="image" src={image.downloadURL} alt={image.filename} />
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
                <FontAwesomeIcon icon="times" className="cross-icon" style={{ color: 'red', fontSize: '24px' } }    onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  handleDelete(image);
                }}/>
              </div>
            )
          );
        })}
      </div>
       
    </div>
  );
};

export default Gallery;




// app.get("/gallery", async (req, res) => {
//     try {
//       const files = [];
//       const [filesResponse] = await storageRef.getFiles({ prefix: 'files/' });
  
//       if (filesResponse[0].name === "files/") {
//         filesResponse.shift(); // Remove the first file
//       }
  
//       for (const file of filesResponse) {
//         const [metadata] = await file.getMetadata();
//         const downloadURL = await file.getSignedUrl({
//           action: 'read',
//           expires: '03-01-2500' // Adjust the expiry date as needed
//         });
  
//         console.log(metadata.name, downloadURL[0]);
  
//         files.push({
//           filename: metadata.name,
//           downloadURL: downloadURL[0]
//         });
//       }
  
//       // Log the files to the console
//       console.log("Files:");
//       files.forEach(file => {
//         console.log(file);
//       });
  
//       // Generate the HTML content dynamically
//       let htmlContent = `
//         <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>File Gallery</title>
//           <style>
//             .gallery {
//               display: flex;
//               flex-wrap: wrap;
//             }
//             .image-container {
//               position: relative;
//               flex: 0 0 25%;
//               margin: 10px;
//             }
//             .image-container img {
//               width: 100%;
//               height: auto;
//               cursor: pointer;
//             }
//             .delete-icon {
//               position: absolute;
//               top: 5px;
//               right: 5px;
//               font-size: 20px;
//               color: red;
//               cursor: pointer;
//             }
//           </style>
//         </head>
//         <body>
//           <h1>File Gallery</h1>
//           <div class="gallery">
//       `;
  
//       files.forEach(file => {
//         htmlContent += `
//             <div class="image-container">
//               <h3>${file.filename}</h3>
//               <a href="${file.downloadURL}" download="${file.filename}">
//                 <img src="${file.downloadURL}" alt="${file.filename}">
//               </a>
//               <span class="delete-icon" onclick="deleteFile('${file.filename}')">&#10060;</span>
//             </div>
//         `;
//       });
  
//       htmlContent += `
//        ${formHTML}
//           </div>
//           <script>
//             function deleteFile(filename) {
//               if (confirm('Are you sure you want to delete this file?')) {
//                 // Perform the delete operation using an AJAX request or your preferred method
//                 // Example AJAX request:
//                 fetch('/delete', {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json'
//                   },
//                   body: JSON.stringify({ filename: filename })
//                 })
//                 .then(response => {
//                   if (response.ok) {
//                     // File deleted successfully, you can reload the gallery or update it dynamically
//                     location.reload();
//                   } else {
//                     // Error occurred during file deletion
//                     console.error('Error deleting file:', response.statusText);
//                   }
//                 })
//                 .catch(error => {
//                   console.error('Error deleting file:', error);
//                 });
//               }
//             }
//           </script>
//         </body>
//         </html>
//       `;
  
//       res.send(htmlContent); // Send the dynamically generated HTML content as the response
//     } catch (error) {
//       console.error("Error fetching image URLs:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });