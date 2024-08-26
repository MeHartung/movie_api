const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

mongoose.connect('mongodb://localhost:27017/myMovieDB', { useNewUrlParser: true, useUnifiedTopology: true });

// CREATE
// Add a new user
app.post('/users', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.body.Username });
        if (user) {
            res.status(400).send(req.body.Username + ' already exists');
        } else {
            const newUser = await Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            });
            res.status(201).json(newUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// UPDATE
// Update user info by user ID
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await Users.findByIdAndUpdate(userId, req.body, { new: true });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).send('No such user');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// ADD a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $push: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) } }, // Correct usage
            { new: true }
        );
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// DELETE (Remove a movie from a user's favorite list)
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) } }, // Correct usage
            { new: true }
        );
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// DELETE a user by username
app.delete('/users/:Username', async (req, res) => {
    try {
        const user = await Users.findOneAndDelete({ Username: req.params.Username });
        if (!user) {
            res.status(404).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// READ 
// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Get a single movie by title
app.get('/movies/:title', async (req, res) => {
    try {
        const movie = await Movies.findOne({ Title: req.params.title });
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).send('No such movie');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Get genre data by name
app.get('/movies/genre/:genreName', async (req, res) => {
    try {
        const genre = await Genres.findOne({ Name: req.params.genreName });
        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(404).send('No such genre');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

// Get director data by name
app.get('/movies/directors/:directorName', async (req, res) => {
    try {
        const director = await Director.findOne({ Name: req.params.directorName });
        if (director) {
            res.status(200).json(director);
        } else {
            res.status(404).send('No such director');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

app.listen(8080, () => console.log("Listening on port 8080"));
