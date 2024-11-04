myFlix API

Overview

myFlix API is a backend service for the movie-based web application “myFlix.” This project provides the server-side logic, including a RESTful API and data management, to support the front-end application. It is built using the MERN stack (MongoDB, Express, React, Node.js) and designed to handle user authentication, authorization, and secure data storage.

Project Goals

	•	Develop a RESTful API to manage movie-related data.
	•	Implement secure user registration, authentication, and profile management.
	•	Set up a MongoDB database to store movie, user, genre, and director information.
	•	Ensure best practices in data security, validation, and modular project structure.

Key Features

	•	Movie Management: Retrieve lists of movies, individual movie details, genres, and directors.
	•	User Management: Allow users to register, update profiles, and manage a list of favorite movies.
	•	Authentication: Secure user authentication using JWT (JSON Web Tokens) and password hashing.

Technical Requirements

	•	Node.js & Express: The server and API are built using Node.js and Express.
	•	MongoDB & Mongoose: A MongoDB database is used for persistent data storage, and Mongoose handles data modeling.
	•	RESTful API: Provides endpoints for CRUD operations on movies and user profiles.
	•	JWT-based Authentication: User sessions are secured with JSON Web Tokens for authorization.
	•	Data Validation: Express-validator and bcrypt are used for data validation and password security.
	•	Deployment: The API can be deployed on platforms like Heroku or rendered as a static documentation on GitHub.

Project Structure

The project follows a structured approach for better readability and maintainability. Key directories and files include:

	•	models: Contains Mongoose schemas for data models, such as Movie, User, Genre, and Director.
	•	passport.js: Configures passport strategies for local and JWT-based authentication.
	•	server.js: Initializes the Express application, sets up middleware, and defines API routes.
	•	auth.js: Manages authentication and route protection using JWT.
	•	jsdoc.json: Configuration file for generating API documentation using JSDoc.
	•	out: Generated folder for HTML documentation, accessible locally or included in the repository.

API Documentation

Detailed API documentation is generated with JSDoc and can be found in the out directory. Open out/index.html in a browser to view endpoint specifications, parameters, and response formats.

Setup and Installation

	1.	Clone this repository:

    git clone <repository-url>

    	2.	Install dependencies:

        npm install

        	3.	Set up environment variables in a .env file:

            CONNECTION_URI=<your MongoDB URI>
JWT_SECRET=<your JWT secret>

	4.	Run the server:

    npm start

    Usage

The API is designed for use in a movie-based web application and includes the following core routes:

	•	/movies: Retrieve a list of movies or a specific movie by title.
	•	/users: Register a new user, update user details, and manage favorite movies.
	•	/genres and /directors: Retrieve details about specific genres and directors.

For a full list of endpoints, methods, and request/response details, refer to the generated documentation in the out folder.

Deployment

This API is designed to be deployable on platforms like Heroku. Ensure your environment variables are set up accordingly in the hosting platform.

Dependencies

	•	express: Framework for building API and handling requests.
	•	mongoose: ORM for MongoDB data modeling.
	•	passport, passport-jwt, passport-local: Middleware for authentication.
	•	bcrypt: Library for hashing passwords.
	•	express-validator: Middleware for request data validation.
	•	cors: Middleware to enable Cross-Origin Resource Sharing.