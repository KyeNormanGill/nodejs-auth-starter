const express = require('express');
const router = express.Router();
const { validLogin, validRegister } = require('../utils.js');

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', (req, res) => {
	if (validLogin(req.body)) res.render('index');
	res.render('login', { error: 'Invalid credentials!' });
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	if (validRegister(req.body)) res.render('index');
	res.render('register', { error: 'Incorrect credentials!' });
});

module.exports = router;
