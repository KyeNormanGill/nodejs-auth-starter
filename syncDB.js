const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const db = require('./database');

const sync = async() => {
	const readdir = promisify(fs.readdir);
	const models = await readdir(path.resolve(__dirname, 'database', 'models')).catch(console.error);

	// Loop the models folder and import them all.
	for (const model of models) {
		db.import(path.resolve(__dirname, 'database', 'models', model));
	}

	// Sync the database so all tables are created.
	db.sync().then(() => console.log('Databse is synced')).catch(console.error);
};

sync();
