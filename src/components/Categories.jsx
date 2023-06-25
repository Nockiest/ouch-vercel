import React from 'react'

const Categories = ({ selectedCategory, setSelectedCategory, categories }) => {
    const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      console.log(selectedCategory)
    };
  
    return (
      <div>
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category)}
            className={selectedCategory === category ? 'selected-category' : ''}
          >
            {category}
          </div>
        ))}
      </div>
    );
  };
  
  export default Categories;