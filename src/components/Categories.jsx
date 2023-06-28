import React from 'react'
import "./categories.css"
const Categories = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  subCategories,
  selectedSubCategory,
  setSelectedSubCategory,
}) => {
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Set to null if already selected
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    if (selectedSubCategory === subCategory) {
      setSelectedSubCategory(null); // Set to null if already selected
    } else {
      setSelectedSubCategory(subCategory);
    }
  };

  console.log('Categories:', categories);
  console.log('Subcategories:', subCategories);

  return (
    <div className="categories-section">
      <div> 
      CATEGORY
      {categories.map((category, index) => (
        <li
          key={index}
          onClick={() => handleCategoryClick(category)}
          className={selectedCategory === category ? 'selected-category' : ''}
        >
          {category}
        </li>
      ))}
      </div>
      <div>
      SUBCATEGORY
      {subCategories.map((subCategory, index) => (
        <li
          key={index}
          onClick={() => handleSubCategoryClick(subCategory)}
          className={selectedSubCategory === subCategory ? 'selected-category' : ''}
        >
          {subCategory}
        </li>
      ))}
      </div>
    </div>
  );
};

export default Categories;
