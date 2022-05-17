const User = require('../models/user');
const Exercise = require('../models/exercise');
const { StatusCodes } = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

//createUser,addExercise,getExerciseLog
const createUser = async (req,res)=>{
    //console.log(`Request body: `, req.body)
    const {username:name} = req.body;

    const user = await User.findOne(req.body);
   // console.log('User already found');

    if(!user){
       // console.log('Creating new user');
        const newUser = await User.create(req.body);
        res.status(200).json({
            username:newUser.username,
            _id:newUser._id
        });
    }
    else
        res.status(200).json({
            username:user.username,
            _id:user._id
        });
};

const addExercise = async (req,res)=>{

    //console.log(`Request body: `, req.body);

    const{':_id':userId,
          description:input_description,
          duration:input_duration,
          date:input_date} = req.body;
    if(!(userId && input_description && input_duration))
        throw new BadRequestError("Please provide userId, description of exercise and duration");

    const user = await User.findById({_id:userId});

    if(!user)
      throw new NotFoundError(`Couldn't find user with id ${userId}` );
    
    const exercise = await Exercise.create({
        username:user.username,
        userId:user._id,
        description:input_description,
        duration:input_duration,
        date:input_date
    }) ;

    res.status(StatusCodes.OK).json({
        _id:exercise.userId,
        username:exercise.username,
        description:exercise.description,
        duration:exercise.duration,
        date:exercise.date.toDateString()
    });
};

const getExerciseLog = async (req,res)=>{
    //console.log(`Request params:`,req.params);
    //console.log(`Request queries:`,req.query);
    const {userId:reqId} = req.params;
    const {from,to,limit} = req.query;

    const query = {};   
    query.userId=reqId;
    if(from||to){
        query.date={};
        if(from)
            query.date['$gte']=from;
        if(to)
            query.date['$lte']=to;
    }

    let result =  Exercise.find(query).sort('date');
 
    console.log('Result: ',result);
    if(limit)
        result = result.limit(Number(limit));
    const exerciseLog = await result;
   if(!exerciseLog || exerciseLog.length===0)
        throw new NotFoundError(`No records found for user id ${reqId}`);
     //return req.status(StatusCodes.NOT_FOUND).send(`Sorry, there were no records found for user id ${reqId}`);

    const returnObj = {
        username:exerciseLog[0].username,
        _id : reqId,
        count:exerciseLog.length,
        log:exerciseLog.map(item=>{
            return {
                description:item.description,
                duration:item.duration,
                date:item.date.toDateString()
            };
        })
    }
    res.status(StatusCodes.OK).json(returnObj);

}

module.exports = {createUser,addExercise,getExerciseLog};