import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  poster: String,
  year: { 
    type: String, 
    required: false 
  },
  rating: {
    type: String,
    default: 'N/A'
  },
  genre: {
    type: String,
    default: 'N/A'
  },
  timesWatched: { 
    type: Number, 
    default: 0 
  },
   plot: { 
    type: String, 
    default: 'N/A' 
  }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
