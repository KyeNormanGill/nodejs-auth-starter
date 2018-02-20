module.exports = {
	validLogin: (body) => {
		return typeof body.username === 'string'
			&& body.username.trim() !== ''
			&& body.password !== '';
	},
	validRegister: (body) => {
		return body.username.trim() !== '' 
			&& body.email.trim() !== '' 
			&& body.emailC.trim() !== '' 
			&& body.password !== '' 
			&& body.passwordC !== '' 
			&& body.password === body.passwordC 
			&& body.email === body.emailC;
	}
}