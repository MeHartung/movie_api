const express = require('express');
const morgan = require('morgan');
fs = require('fs'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('common'));


let topMovies = [
    { title: 'Harry Potter and the Sorcerer\'s Stone', director: 'J.K. Rowling' },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', director: 'J.R.R. Tolkien' },
    { title: 'Twilight', director: 'Stephenie Meyer' },
    { title: 'The Shawshank Redemption', director: 'Stephen King' },
    { title: 'Inception', director: 'Christopher Nolan' },
    { title: 'The Dark Knight', director: 'Christopher Nolan' },
    { title: 'Forrest Gump', director: 'Robert Zemeckis' },
    { title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski' },
    { title: 'The Godfather', director: 'Francis Ford Coppola' },
    { title: 'Pulp Fiction', director: 'Quentin Tarantino' }
];


app.get('/movies', (req, res) => {
    res.json(topMovies);
});


app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.use(express.static('public'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
