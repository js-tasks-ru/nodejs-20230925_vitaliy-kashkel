/* eslint-disable max-len */
const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const isEmailValid = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email);
  if (!isEmailValid) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Не валидный email'}};
    return;
  }

  const user= await User.findOne({email});
  if (user) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  const token = uuid();
  const u = new User({
    email,
    displayName,
    verificationToken: token,
  });
  await u.setPassword(password);
  await u.save();


  await sendMail({
    template: 'confirmation',
    locals: {token: 'token'},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  user.verificationToken = undefined;
  await user.save();
  ctx.status = 200;
  ctx.body = {token: uuid()};
};
