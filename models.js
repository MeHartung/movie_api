/**
 * @fileoverview Mongoose schemas for users, movies, genres, and directors.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Genre Schema
/**
 * Schema for storing genre information.
 */
const genreSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Description: String
});

// Director Schema
/**
 * Schema for storing director information.
 */
const directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: String,
    Birth: Date,
    Death: Date
});

// Movie Schema
/**
 * Schema for storing movie information.
 */
const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: Schema.Types.ObjectId, ref: 'Director' },
    ImagePath: String,
    Featured: Boolean
});

// User Schema
/**
 * Schema for storing user information.
 */
const userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes a password before saving.
 * @param {string} password - Plain text password.
 * @returns {string} Hashed password.
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password.
 * @param {string} password - Plain text password.
 * @returns {boolean} Returns true if the password is correct.
 */
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

// Create Models
const Genre = mongoose.model('Genre', genreSchema);
const Director = mongoose.model('Director', directorSchema);
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

// Export Models