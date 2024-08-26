const mongoose = require('mongoose');

// Genre Schema
const genreSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Description: String
});

// Director Schema
const directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: String,
    Birth: Date,
    Death: Date
});

// Movie Schema
const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

// User Schema
const userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Genre, Director, Movie, User };
