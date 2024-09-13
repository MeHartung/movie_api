const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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
    Genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: Schema.Types.ObjectId, ref: 'Director' },
    ImagePath: String,
    Featured: Boolean
});


module.exports.Movie = Movie;

// User Schema
const userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};


const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Genre, Director, Movie, User };
