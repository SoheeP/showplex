function isLogged(req, res, next) {
  console.log('Check out :: login');
  if (!req.session.user) {
    res.redirect('/auth/signin')
  } else {
    console.log('Login Suceess!')
    next()
  }
}

function wrap(asyncFn) {
  return (async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
  })
};

exports.isLogged = isLogged;
exports.wrap     = wrap;