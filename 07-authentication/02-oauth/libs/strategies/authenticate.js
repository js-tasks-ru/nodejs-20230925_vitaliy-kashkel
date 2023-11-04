const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  if (!/^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(email)) {
    done({name: 'ValidationError', errors: {email: {message: 'Некорректный email.'}}}, false);
  }

  const user = await User.findOne({email});
  if (!user) {
    const res = await User.create({
      email,
      displayName,
    });
    done(null, res);
  }

  done(null, user);
};
