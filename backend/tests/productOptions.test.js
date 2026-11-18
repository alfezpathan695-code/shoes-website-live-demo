const getProductOptions = require('../src/utils/productOptions');

test('footwear offers shoe size variants even in an apparel category', () => {
  const options = getProductOptions({ category: 'Men', name: 'Minimal everyday sneakers' });

  expect(options.variantLabel).toBe('Size');
  expect(options.variants).toContain('UK 8');
});

test('apparel offers its category size variants', () => {
  const options = getProductOptions({ category: 'Women', name: 'Cotton kurta' });

  expect(options.variants).toContain('M');
});

test('non-sized products use the standard option', () => {
  expect(getProductOptions({ category: 'Electronics', name: 'Wireless earbuds' })).toEqual({
    variantLabel: null,
    variants: [],
  });
});
