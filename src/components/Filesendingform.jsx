 
import "./fileSendingForm.css"
import React, { useState } from 'react';
import axios from 'axios';

const FileSendingForm = ({ onFileUpload, user}) => {
  const [filename, setFilename] = useState('');
  // const [user, setUser] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const modifiedFileName = filename.replace(/\s/g, '%'); // Replace whitespace with %
      const formData = new FormData();
      const displayNameWithoutSpaces = user.displayName.replace(/\s/g, '');

      formData.append('file', selectedFile);
      formData.append('filename', modifiedFileName);
      
      formData.append('user', `${displayNameWithoutSpaces} ${user.email}`);
      formData.append('category', category);
      formData.append('description', description);
  
      // Call the onFileUpload function with the form data
      await onFileUpload(formData);
  
      // ...
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle the error, display an error message, etc.
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="filename">Filename:</label>
        <input
          type="text"
          id="filename"
          name="filename"
          value={filename}
          required
          onChange={(e) => setFilename(e.target.value)}
        />
      </div>
{/* 
      <div>
        <label htmlFor="user">User:</label>
        <input
          type="text"
          id="user"
          name="user"
          value={user}
          required
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
         */}
      <div>
        <label htmlFor="file">File:</label>
        <input
          type="file"
          id="file"
          name="file"
          required
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          name="category" // Update the name attribute to "category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <input type="submit" value="Upload" />
    </form>
  );
};

export default FileSendingForm;