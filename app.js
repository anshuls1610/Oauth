const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
const url = 'mongodb+srv://anshul:anshul@cluster0.in7vu.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(url, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	}) .then(() => {
    	console.log('Connected to DB');
	}).catch(err => {
		console.log("Error: cd ", err.message);
	});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Server has started');
});