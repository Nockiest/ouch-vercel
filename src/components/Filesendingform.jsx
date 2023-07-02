 
import "./fileSendingForm.css"
import React, { useState, useRef } from 'react';
import axios from 'axios';

 
 
const FileSendingForm = ({ onFileUpload, user }) => {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  // const [category, setCategory] = useState('');
  // const [subcategory, setSubcategory] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const handleFileChange = (event) => {
    const files = event.target.files; // Get the selected files

    // Convert the FileList object to an array
    const fileList = Array.from(files);

    // Set the imageUpload state to the array of files
    setImageUpload(fileList);

    // Show image preview for the first file
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreviewRef.current.src = e.target.result;
    };
    reader.readAsDataURL(fileList[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageUpload || imageUpload.length === 0) {
      return alert('Please choose a file');
    }

    try {
      // Perform actions with the selected files, such as uploading to a server
      await onFileUpload({
        files: imageUpload,
        formData: {
          filename,
          description,
          category: "x",
          subcategory: "y",
          user: user.displayName.replace(/\s/g, ''),
        },
      });

      // Reset the form fields and file input
      setFilename('');
      setImageUpload(null);
      setDescription('');
      // setCategory('');
      // setSubcategory('');
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  // const handleCategoryChange = (event) => {
  //   setCategory(event.target.value);
  // };

  // const handleSubcategoryChange = (event) => {
  //   setSubcategory(event.target.value);
  // };

  // const showSubcategoryField = category.trim() !== '';

  const formData = {
    filename,
    imageUpload,
    description: "null",
    category: "x",
    subcategory: "y",
    user: user.displayName.replace(/\s/g, ''),
  };


  return (
    <form className="add-form" onSubmit={handleSubmit}>
     
      <div className="input-field-row"> 
        <div className="input-field">
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
        {/* <div className="input-field">
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
          <div className="input-field">
            <label htmlFor="subcategory">Subcategory:</label>
            <input
              type="text"
              id="subcategory"
              name="subcategory"
              value={subcategory}
              onChange={handleSubcategoryChange}
            />
          </div>
        )} */}
        {/* <div className="input-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div> */}
    </div>
   
      
    <div className="img-preview">
  {imageUpload && (
    <img className="preview-image" src="" alt="Preview" ref={imagePreviewRef} />
    )}
  </div>
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      <input type="submit" value="Upload" />
    </form>
  );
};
 export default FileSendingForm;