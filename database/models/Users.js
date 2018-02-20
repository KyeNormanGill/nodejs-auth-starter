const db = require('../index.js');
const Sequelize = require('sequelize');

const Users = db.define('users', {
	Username: {
		type: Sequelize.STRING,
		unique: true
	},
	Email: {
		type: Sequelize.STRING,
		unique: true
	},
	Password: Sequelize.STRING
});

module.exports = Users;
