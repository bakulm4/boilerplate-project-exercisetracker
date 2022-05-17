//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  console.log(`Error object: `, err);

  console.log(`Error name: `, err.name);
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong'
  };
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // if(err.code && err.code === 11000){
  //   customError.msg= `Duplicate value entered for ${Object.keys(err.keyValue)}. Please choose a different value`;
  //   customError.statusCode = 400;
  // }
  if(err.name && err.name==='ValidationError'){
    console.log(Object.values(err.errors));
    customError.statusCode = 400;
    customError.msg = Object.values(err.errors).map(item=>item.message).join(', ');
  }

  if(err.name && err.name==='CastError'){
    customError.msg=`User Id ${Object.values(err.value)[0]} is not a valid format. Please provide a valid User Id`;
    customError.statusCode=404;
  }
  
  return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware
