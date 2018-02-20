const express = require('express');
const router = express.Router();
const { validLogin, validRegister } = require('../utils.js');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const Users = require('../database/models/Users.js');
const { Op } = require('sequelize');

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', (req, res) => {
	if (!validLogin(req.body)) return res.render('login', { error: 'Invalid credentials!' });;

	// Check db for user.

	res.render('index')
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', async(req, res) => {
	if (!validRegister(req.body)) return res.render('register', { error: 'Incorrect credentials!' });

	// Hash the password. Never store plain text passwords.
	const hash = await bcrypt.hash(req.body.password, saltrounds);
	
	const user = {
		Username: req.body.username,
		Email: req.body.email,
		Password: hash
	}

	// Find user with same username or email.
	const userFound = await Users.find({ where: { [Op.or]: [{ Username: user.Username}, { Email: user.Email }] } });
	if (userFound) return res.render('register', { error: `${userFound.Username === user.Username ? 'Username' : 'Email'} is already in use!` });
	
	// Create user.
	const createdUser = await Users.create(user);

	// Add user to the session.
	req.session.user = {
		Username: createdUser.Username,
		Email: createdUser.Email,
		ID: createdUser.id
	};

	res.render('index');
});

module.exports = router;
