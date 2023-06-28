 
import "./fileSendingForm.css"
import React, { useState, useRef } from 'react';
import axios from 'axios';

 
 
const FileSendingForm = ({ onFileUpload, user }) => {
  const [filename, setFilename] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

   const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(fileInputRef.current);

  if (!fileInputRef.current || !fileInputRef.current.files[0]) {
    return alert('Please choose a file');
  }

  try {
    const sanitizedFormData = {};
    let needsReplacing = false;

    for (const field in formData) {
      const value = formData[field];
      let sanitizedValue = value;

      if (typeof value === 'string') {
        console.log(value.match(/[_/]/g), value.match(/\s/g));

        if (value.match(/[_/]/g)) {
          sanitizedValue = value.replace(/[_/]/g, '');
          needsReplacing = field;
    } //dont allow / and _ in the form data

        if (value.match(/\s/g)) {
          sanitizedValue = sanitizedValue.replace(/\s/g, '%');
          // needsReplacing = field;
        }
      }

      sanitizedFormData[field] = sanitizedValue;
    }

    if (needsReplacing) {
      alert(
        `Make sure to remove "_" and "/" characters from the ${needsReplacing} field.`
      );
    } else {
      console.log("doesnt need", needsReplacing)
      await onFileUpload(sanitizedFormData);
      setFilename('');
      setImageUpload(null);
      setDescription('');
      setCategory('');
      setSubcategory('');
      fileInputRef.current.value = ''; 
    }

     
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
  };

  const showSubcategoryField = category.trim() !== '';

  const formData = {
    filename,
    imageUpload,
    description,
    category,
    subcategory,
    user: user.displayName.replace(/\s/g, ''),
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageUpload(file);

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreviewRef.current.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
      <div className="input-field">
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
      )}
      <div className="input-field">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
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