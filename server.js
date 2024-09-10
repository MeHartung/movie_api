const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
console.log('Database URI:', process.env.CONNECTION_URI);



const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
const { check, validationResult } = require('express-validator');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Director = Models.Director;

// mongoose.connect('mongodb://localhost:27017/myMovieDB', { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb+srv://myFlixDbAdmin:Berlin2-@cluster0.mhuei.mongodb.net/myFlixDb?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.log('Database connection error:', error));


app.post('/users',
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });




// Update user info by username

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    try {
        let updateFields = {
            Username: req.body.Username,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        };

        // Only hash the password 
        if (req.body.Password) {
            updateFields.Password = Users.hashPassword(req.body.Password);
        }

        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $set: updateFields },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('No such user');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});


// ADD a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the authenticated user is the same as the user adding the favorite movie
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $push: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) } },
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the authenticated user is the same as the user deleting the favorite movie
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: new mongoose.Types.ObjectId(req.params.MovieID) } },
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the authenticated user is the same as the user being deleted
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

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
/* 
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
*/

app.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});


/*
app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
*/



// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Check if the authenticated user is the same as the requested user
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    try {
        const user = await Users.findOne({ Username: req.params.Username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
    }
});

// Get a single movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
