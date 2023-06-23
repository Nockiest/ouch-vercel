 
import "./fileSendingForm.css"
import React, { useState } from 'react';
import axios from 'axios';

const FileSendingForm = () => {
  const [filename, setFilename] = useState('');
  const [user, setUser] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filename', filename);
      formData.append('user', user);
      formData.append('description', description);

      // Make the POST request to your server
      const response = await axios.post('/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File upload response:', response.data);

      // Clear the form fields after successful submission
      setFilename('');
      setUser('');
      setSelectedFile(null);
      setDescription('');
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
