require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect.js')
const authenticationMiddleware = require('./middleware/authentication.js')
const app = express();

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//routes
const authRouter = require('./routes/auth.js')
const jobsRouter = require('./routes/jobs.js')

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(express.json());
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs', authenticationMiddleware,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
