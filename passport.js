/**
 * @fileoverview Passport authentication strategies for local and JWT authentication.
 */

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt'),
    bcrypt = require('bcrypt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
        async (username, password, callback) => {
            await Users.findOne({ Username: username })
                .then((user) => {
                    if (!user) {
                        return callback(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }
                    // Compare stored hashed password with the provided plain text password
                    if (!bcrypt.compareSync(password, user.Password)) {
                        return callback(null, false, { message: 'Incorrect password.' });
                    }
                    return callback(null, user);
                })
                .catch((error) => {
                    return callback(error);
                });
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));
