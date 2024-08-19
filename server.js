const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');  // Corrected import for uuid

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: ["The Godfather"],
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["The Shawshank Redemption"]
    }
];

let movies = [
    {
        "Title": "The Shawshank Redemption",
        "Description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "Genre": {
            "Name": "Drama",
            "Description": "A genre that focuses on the emotional and relational aspects of characters."
        },
        "Director": {
            "Name": "Frank Darabont",
            "Bio": "Frank Darabont is an American director, screenwriter, and producer known for his adaptations of Stephen King novels.",
            "Birth": "1959-01-28"
        },
        "ImageURL": "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg",
        "Featured": true
    },
    {
        "Title": "The Godfather",
        "Description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "Genre": {
            "Name": "Crime",
            "Description": "A genre that focuses on crime, criminal acts, and the law enforcement processes."
        },
        "Director": {
            "Name": "Francis Ford Coppola",
            "Bio": "Francis Ford Coppola is an American film director, producer, and screenwriter known for his influential films in the 1970s.",
            "Birth": "1939-04-07"
        },
        "ImageURL": "https://m.media-amazon.com/images/I/41+KlYB4b5L._AC_.jpg",
        "Featured": true
    },
    {
        "Title": "Inception",
        "Description": "A thief who enters the dreams of others to steal secrets from their subconscious is given the inverse task of planting an idea into the mind of a CEO.",
        "Genre": {
            "Name": "Science Fiction",
            "Description": "A genre that deals with imaginative and futuristic concepts such as advanced science and technology."
        },
        "Director": {
            "Name": "Christopher Nolan",
            "Bio": "Christopher Nolan is a British-American filmmaker known for his complex narratives and distinctive visual style.",
            "Birth": "1970-07-30"
        },
        "ImageURL": "https://m.media-amazon.com/images/I/51gQ35zyi+L._AC_.jpg",
        "Featured": true
    }
];

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names');
    }
});

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

// CREATE (Add a movie to a user's favorite list)
app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s favorite movies list.`);
    } else {
        res.status(404).send('No such user');
    }
});

// DELETE (Remove a movie from a user's favorite list)
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorite movies list.`);
    } else {
        res.status(404).send('No such user');
    }
});

// DELETE (Remove a user)
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User ${id} has been deleted.`);
    } else {
        res.status(404).send('No such user');
    }
});

// READ 
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('no such movie');
    }
});

// READ 
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const movie = movies.find(movie => movie.Genre.Name === genreName);

    if (movie) {
        res.status(200).json(movie.Genre);
    } else {
        res.status(404).send('no such genre');
    }
});

// READ 
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const movie = movies.find(movie => movie.Director.Name === directorName);

    if (movie) {
        res.status(200).json(movie.Director);
    } else {
        res.status(404).send('no such director');
    }
});

app.listen(8080, () => console.log("listening on 8080"));
