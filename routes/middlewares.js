function wrap(asyncFn){
  return (async (req, res, next) => {
    try{
      return await asyncFn(req, res, next);
    } catch(error){
      console.log(error.message);
      return next(error);
    }
  })
};

exports.wrap = wrap;