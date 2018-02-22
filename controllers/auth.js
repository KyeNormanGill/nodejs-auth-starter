const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const { validLogin, validRegister } = require('../utils.js');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const database = require('../database');
const Users = database.import('../database/models/Users.js');
const { Op } = require('sequelize');

router.get('/login', (req, res) => {
	res.render('login', { user: req.session ? req.session.user : undefined });
});

router.post('/login', async(req, res) => {
	if (!validLogin(req.body)) return res.render('login', { error: 'Invalid credentials!' });

	// Check db for user.
	const userFound = await Users.find({ where: { [Op.or]: [{ Username: req.body.username }, { Email: req.body.username }] } });
	if (!userFound) return res.render('login', { error: 'No account found!' });

	// Compare plain text password with database hash.
	if (!await bcrypt.compare(req.body.password, userFound.Password)) return res.render('login', { error: 'Password incorrect!' });

	// Add user to session.
	req.session.user = {
		Username: userFound.Username,
		Email: userFound.Email,
		ID: userFound.id
	};

	res.render('index', { user: req.session ? req.session.user : undefined });
});

router.get('/register', (req, res) => {
	res.render('register', { user: req.session ? req.session.user : undefined });
});

router.post('/register', async(req, res) => {
	if (!validRegister(req.body)) return res.render('register', { error: 'Incorrect credentials!' });

	// Hash the password. Never store plain text passwords.
	const hash = await bcrypt.hash(req.body.password, saltrounds);

	const user = {
		Username: req.body.username,
		Email: req.body.email,
		Password: hash
	};

	// Ensure only numbers and letters.
	if (!user.Username.match(/^[0-9a-zA-Z]+$/)) return res.render('register', { error: 'Alphanumeric characters only (Aa-Zz, 0-9)!' });

	// Find user with same username or email and return error if found.
	const userFound = await Users.find({ where: { [Op.or]: [{ Username: user.Username }, { Email: user.Email }] } });
	if (userFound) return res.render('register', { error: `${userFound.Username === user.Username ? 'Username' : 'Email'} is already in use!` });

	const createdUser = await Users.create(user);

	// Add user to the session for persistent logins through requests.
	req.session.user = {
		Username: createdUser.Username,
		Email: createdUser.Email,
		ID: createdUser.id
	};

	res.render('index', { user: req.session ? req.session.user : undefined });
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(err => {
		if (err) return next(err);
		res.render('index', { user: req.session ? req.session.user : undefined });
	});
});

module.exports = router;
