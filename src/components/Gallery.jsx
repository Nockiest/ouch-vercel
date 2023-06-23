import React, { useEffect, useState } from "react";
import "./gallery.css";

const Gallery = () => {
    const [storedImages, setStoredImages] = useState([]);
  
    useEffect(() => {
      fetch("/gallery")
        .then((response) => response.json())
        .then((data) => {
          const images = data.map((file) => ({
            filename: file.filename,
            downloadURL: file.downloadURL,
          }));
          setStoredImages(images);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }, []);
  
    return (
      <div>
        <h2>Gallery</h2>
        {/* Render the stored images */}
        <div className="gallery"> 
        {storedImages.map((image) => (
          <div className="image-src"> 
          <h3 className="image-header">{image.filename}</h3>
          <div className="image-item" key={image.filename}>
             
             
            <img className="image" src={image.downloadURL} alt={image.filename} />
            
          </div>
          </div>
        ))}
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