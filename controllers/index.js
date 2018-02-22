const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { user: req.session ? req.session.user : undefined });
});

module.exports = router;
