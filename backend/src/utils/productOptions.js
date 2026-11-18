function getProductOptions(product) {
  if (product.category === 'Shoes' || /shoe|sneaker|slipper|sandal|loafer|boot/i.test(product.name)) {
    return { variantLabel: 'Size', variants: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'] };
  }

  const clothingSizes = {
    Women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    Men: ['S', 'M', 'L', 'XL', 'XXL'],
    Girls: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    Boys: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
  };

  if (clothingSizes[product.category]) {
    return { variantLabel: 'Size', variants: clothingSizes[product.category] };
  }

  if (product.category === 'Kids' && /onesie|romper|clothing|co-ord|dress|socks|booties/i.test(product.name)) {
    return {
      variantLabel: 'Size',
      variants: ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years'],
    };
  }

  return { variantLabel: null, variants: [] };
}

module.exports = getProductOptions;
