import React from 'react';
import Icon from './Icon';

function CategorySection({ categories, onSelect }) {
  return (
    <section className="category-section">
      <div className="section-heading">
        <div><span className="eyebrow">A LITTLE BIT OF EVERYTHING</span><h2>Shop by category</h2></div>
        <button className="text-link" onClick={() => onSelect('All')}>See everything <Icon name="arrow" size={17} /></button>
      </div>
      <div className="category-tiles">
        {categories.slice(1, 7).map((item, index) => (
          <button className={`category-tile tile-${index + 1}`} key={item.name} onClick={() => onSelect(item.name)}>
            <span className="tile-emoji">{item.emoji}</span>
            <span className="tile-name">{item.name}</span>
            <span className="tile-arrow"><Icon name="arrow" size={15} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
