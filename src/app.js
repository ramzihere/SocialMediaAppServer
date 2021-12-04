const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('database connected successfully');
});
mongoose.connection.on('error', (err) => {
  console.log('error connecting to database', err);
});

const PORT = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api', authRoute, userRoute);

app.listen(PORT, () => {
  console.log('server is up and running on port ' + PORT);
});
