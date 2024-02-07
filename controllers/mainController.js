import Movie from '../models/Movie.js';
let movies, movieData, timesWatched, totalTimesWatched, sortCriteria;

let totalMovies = 0;
let watchedMovies = [];
let savedMovies = [];
let isDescendingOrder = true;


export const loadPage = async (req, res) => {
  try {
    savedMovies = await Movie.find();
    aggregateMoviesData();
    res.render('main', { movies: null, watchedMovies: savedMovies, totalMovies, totalTimesWatched });
  } catch (error) {
    console.error(`Error loading page: ${error.message}`);
    res.status(500).send('Error loading page');
  }
};

export const displayMovieDetails = async (req, res) => {
  const query = req.body.query;
   
  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.apiKey}`);
     
    movieData = await response.json();
    aggregateMoviesData();
    res.render('main', { movies: movieData, watchedMovies: savedMovies, totalMovies, totalTimesWatched });
    //res.redirect('/');
    
  } catch (error) {
      console.error(`Error fetching movie details: ${error.message}`);
  }
};

export const watchMovie = async (req, res) => {
  const movieId = req.body.movieId;

  try {
    const movie = await Movie.findById(movieId);
   
     
    if (movie) {
      movie.timesWatched += 1;
      console.log
      await movie.save();
      
      res.redirect('/')
    } else {
      req.flash('error', 'Movie not found');
      res.redirect('/');
    }
  } catch (error) {
    console.error(`Error watching movie: ${error.message}`);
    res.status(500).send('Error watching movie');
  }
};

export const saveMovie = async (req, res) => {
  const title  = req.body.title;
   
     
  let currMovie;
  try {
    const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${process.env.apiKey}`);
    currMovie = await response.json();
     
     
  } catch (error) {
      console.error(`Error fetching movie details: ${error.message}`);
  }
   
  try {
    // Check if the movie already exists in the database
    let movie = await Movie.findOne({ title: title });

    if (movie) {
      // If movie exists, increment the timesWatched
      movie.timesWatched += 1;
      await movie.save();
    } else {
      // If movie doesn't exist, create a new one
       
      movie = new Movie({
        title: currMovie.Title,
        poster: currMovie.Poster,
        year: currMovie.Year,
        rating: currMovie.Rated,
        genre: currMovie.Genre,
        timesWatched: 1,
        plot: currMovie.Plot
      });
      await movie.save();
    }
     
    savedMovies.push(currMovie);
    req.flash('success', 'movie added!');
    res.redirect('/'); //redirect to loading function
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
}

export const deleteWatchedMovie = async (req, res) => {
   
   const movieId = req.body.movieId;
   

   try {
      const result = await Movie.findByIdAndDelete(movieId);
      console.log(result);
      req.flash('success', 'movie deleted!');
      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
  }
  
};

export const sortMoviesByRating = async (req, res) => {
  const selectedRating = req.body.rating;

  try {
    let sortedMovies;

    if (selectedRating.toLowerCase() === 'all') {
         savedMovies = await Movie.find();
         res.redirect('/');
    } else {
         savedMovies = await Movie.find();
         sortedMovies = savedMovies.filter(movie => movie.rating === selectedRating);
    }
    aggregateMoviesData();
    res.render('main', { movies: null, watchedMovies: sortedMovies, totalMovies, totalTimesWatched });
  } catch (error) {
    console.error(`Error sorting movies by rating: ${error.message}`);
    res.status(500).send('Error sorting movies by rating');
  }
}; 

export const showMovieDetails = async (req, res) => {
  const movieId = req.params.id; 

  try {
    const movie = await Movie.findById(movieId);

    if (movie) {
      res.render('movie', { movie });
    } else {
      req.flash('error', 'Movie not found');
      res.redirect('/');
    }
  } catch (error) {
    console.error(`Error fetching movie details: ${error.message}`);
    res.status(500).send('Error fetching movie details');
  }
};


export const sortWatchedMovies = async (req, res) => {
  try {
    savedMovies = await Movie.find();

    isDescendingOrder = !isDescendingOrder;
    savedMovies.sort((a, b) => {
      return isDescendingOrder ? b.timesWatched - a.timesWatched : a.timesWatched - b.timesWatched;
    });

    aggregateMoviesData();
    res.render('main', { movies: null, watchedMovies: savedMovies, totalMovies, totalTimesWatched });
  } catch (error) {
    console.error(`Error sorting watched movies: ${error.message}`);
    res.status(500).send('Error sorting watched movies');
  }
};


const aggregateMoviesData = async () => {
  try {
    const result = await Movie.aggregate([
      {
        $group: {
          _id: null, // Grouping without a specific field to aggregate all documents
          totalMovies: { $sum: 1 }, // Counting the total number of movies
          totalTimesWatched: { $sum: "$timesWatched" } // Summing up all timesWatched values
        }
      }
    ]);

    if (result.length > 0) {
      // Extracting the result from the first element of the result array
      totalMovies = result[0].totalMovies;
      totalTimesWatched = result[0].totalTimesWatched;
    } else {
      console.log("No data found.");
    }
  } catch (error) {
    console.error("Error aggregating movie data:", error);
  }
}; 
//COME BACK TO THIS FUNCTION

