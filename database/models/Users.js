module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		Username: {
			type: DataTypes.STRING,
			unique: true
		},
		Email: {
			type: DataTypes.STRING,
			unique: true
		},
		Password: DataTypes.STRING
	});
};
