import React, { useEffect, useState } from "react";
import "./gallery.css";

const Gallery = ({ user, storedImages, searchedTerm }) => {
 
  console.log(user)
  const displayNameWithoutSpaces = user.displayName.replace(/\s/g, '');
  const userCredentials = `${displayNameWithoutSpaces} ${user.email}`;
console.log(userCredentials)
  const extractNameAndCategory = (filename) => {
    // Extract name and category from the filename
    const nameWithCategory = filename.split('.')[0];

    const parts = nameWithCategory.split('_');
    console.log(parts, userCredentials);
    const name = parts[0].substring(parts[0].indexOf('/') + 1);
    const category = parts[1];
    const header = parts.slice(2).join('_')+".cz"; // Extract the part after "xyz"
   console.log(header === userCredentials, header, userCredentials )
    return { name, category, header };
  };

  // Filter the storedImages based on the searched term
  const filteredImages = storedImages.filter((image) => {
    const { name } = extractNameAndCategory(image.filename);
    return name.toLowerCase().includes(searchedTerm.toLowerCase());
  });
  
  return (
    <div>
      <h2>Gallery</h2>
      {/* Render the filtered images */}
      <div className="gallery">
        {filteredImages.map((image) => {
          const { name, category, header } = extractNameAndCategory(image.filename);

          return (
             userCredentials == header && (
              <div className="image-src" key={image.filename}>
                <h3 className="image-header">{name}</h3> {/* Display the header */}
                <h4 className="image-category">{category}</h4>
                <div className="image-item">
                  <img className="image" src={image.downloadURL} alt={image.filename} />
                </div>
                <p>{header}</p>
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