const express = require('express');
require('dotenv').config();
require('express-async-errors');

const app = express()

//extra-packages
const cors = require('cors')

//connectDB
const connectDB = require('./db/connect');

//routers
const userRouter = require('./routes/users');

//error-handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded());

//routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users',userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();