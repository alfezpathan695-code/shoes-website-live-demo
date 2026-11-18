import React from 'react';

function CategoryNav({ categories, activeCategory, query, onSelect }) {
  return (
    <nav className="category-nav" aria-label="Shop categories">
      {categories.map((item) => (
        <button
          key={item.name}
          className={activeCategory === item.name && !query ? 'nav-category active' : 'nav-category'}
          onClick={() => onSelect(item.name)}
        >
          <span>{item.emoji}</span>{item.name === 'All' ? 'Shop all' : item.name}
        </button>
      ))}
    </nav>
  );
}

export default CategoryNav;
