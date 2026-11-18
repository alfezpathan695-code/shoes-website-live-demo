function serializeProduct(product) {
  const { _id, __v, productId, ...fields } = product;
  return { ...fields, id: productId };
}

module.exports = serializeProduct;
