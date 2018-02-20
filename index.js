const express = require('express');
const path = require('path');
const session = require('express-session');
const test = require('./controllers/test.js');

const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
	secret: 'randomkey',
	name: 'randomname',
	resave: true,
	saveUninitialized: true
}));

app.use((req, res, next) => {
	console.log(req.session);
	next();
});

app.use('/', test);

app.listen(8080, '', () => {
	console.log('Website listening on port: 8080');
});
