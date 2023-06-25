 
import "./fileSendingForm.css"
import React, { useState } from 'react';
import axios from 'axios';

const FileSendingForm = ({ setImageUpload, onFileUpload, user }) => {
  const [filename, setFilename] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState(''); // New state for subcategory

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const modifiedFileName = filename.replace(/\s/g, '%');
      const formData = new FormData();
      const displayNameWithoutSpaces = user.displayName.replace(/\s/g, '');

      formData.append('file', selectedFile);
      formData.append('filename', modifiedFileName);
      formData.append('user', `${displayNameWithoutSpaces} ${user.email}`);
      formData.append('category', category);
      formData.append('subcategory', subcategory); // Append subcategory to form data
      formData.append('description', description);

      await onFileUpload(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
  };

  const showSubcategoryField = category.trim() !== ''; // Check if category is not empty

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
        <div>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
        </div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          name="category"
          value={category}
          required
          onChange={handleCategoryChange}
        />
      </div>
      {showSubcategoryField && ( // Render subcategory field if category is not empty
        <div>
          <label htmlFor="subcategory">Subcategory:</label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            value={subcategory}
            onChange={handleSubcategoryChange}
          />
        </div>
      )}
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
 