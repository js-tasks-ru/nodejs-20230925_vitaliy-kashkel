const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'Invalid subcategory ID');
  }

  const products = await Product.find({subcategory});
  ctx.status = 200;
  ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.status = 200;
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.throw(400, 'Invalid product ID');
  }

  const product = await Product.findById(productId);
  if (!product) {
    ctx.throw(404, 'Product not found');
  }

  ctx.status = 200;
  ctx.body = {product};
};

