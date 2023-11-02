const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const str = ctx.query.query;
  if (!str) {
    ctx.status = 200;
    ctx.body(await Product.find({}));
    return;
  }

  const products = await Product.find({$text: {$search: str}});
  ctx.status = 200;
  ctx.body = {products};
};
