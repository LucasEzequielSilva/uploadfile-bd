import config from '../config.mjs';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const url = config.mongoURI;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// connect to the database
 connect.then(() => {
    console.log('Connected to database: GridApp');
}, (err) => console.log(err));
