const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./passport');
const { check, validationResult } = require('express-validator');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const allowedOrigins = ['http://localhost:1234'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true
}));

app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error('Database connection error:', error));

app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = bcrypt.hashSync(req.body.Password, 10);
        const existingUser = await Users.findOne({ Username: req.body.Username });

        if (existingUser) {
            return res.status(400).send(req.body.Username + ' already exists');
        }

        const user = await Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.body.Username });

        if (!user) {
            return res.status(401).send('User not found');
        }

        const isMatch = bcrypt.compareSync(req.body.Password, user.Password);

        if (!isMatch) {
            return res.status(401).send('Password is incorrect');
        }

        const token = jwt.sign(
            { Username: user.Username, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
    }

    try {
        let updateFields = {
            Email: req.body.Email,
            Birthday: req.body.Birthday
        };

        if (req.body.Password) {
            updateFields.Password = bcrypt.hashSync(req.body.Password, 10);
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
        res.status(500).send('Error: ' + err.message);
    }
});

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
    }

    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $push: { FavoriteMovies: req.params.MovieID } },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
    }

    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: req.params.MovieID } },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
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
        res.status(500).send('Error: ' + err.message);
    }
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movies.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error.message);
    }
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(403).send('Permission denied');
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
        res.status(500).send('Error: ' + error.message);
    }
});

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
        res.status(500).send('Error: ' + err.message);
    }
});

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
        res.status(500).send('Error: ' + err.message);
    }
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const director = await Directors.findOne({ Name: req.params.directorName });
        if (director) {
            res.status(200).json(director);
        } else {
            res.status(404).send('No such director');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
