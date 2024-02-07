import express from 'express';
import session from 'express-session';
import flash from 'connect-flash'; 
import fetch from 'node-fetch';
import routes from './routes/mainRoutes.js';
import Movie from './models/Movie.js';
import mongoose from 'mongoose';


import dotenv from 'dotenv'; 
dotenv.config({ path: 'process.env' });

const port = 9897;
const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Use express-session and connect-flash middleware
app.use(session({
    secret: 'hehee-saba',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});


app.use('/', routes);



mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


