require('dotenv').config();
const path = require('path');
const { pathToFileURL } = require('url');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const getProductOptions = require('../utils/productOptions');

async function seedProducts() {
  await connectDB();
  try {
    await Product.init();
    const catalogUrl = pathToFileURL(path.resolve(__dirname, '../../../frontend/src/data/storeData.js'));
    const { products } = await import(catalogUrl.href);
    const operations = products.map((product) => {
      const { variants, variantLabel } = getProductOptions(product);
      return {
        updateOne: {
          filter: { productId: product.id },
          update: {
            $set: {
              ...product,
              productId: product.id,
              variants,
              variantLabel,
            },
          },
          upsert: true,
        },
      };
    });

    await Product.bulkWrite(operations, { ordered: true });
    console.log(`Seeded ${products.length} catalog products.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts().catch((error) => {
  console.error('Product seeding failed:', error.message);
  process.exitCode = 1;
});
