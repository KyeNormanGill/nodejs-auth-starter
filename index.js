const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const index = require('./controllers/index.js');
const auth = require('./controllers/auth.js');
const db = require('./database');
const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'randomkey',
	name: 'randomname',
	resave: true,
	saveUninitialized: true
}));

app.use('/', index);
app.use('/auth', auth);

db.sync().then(() => {
	app.listen(8080, '', () => {
		console.log('Website listening on port: 8080');
	});
});
