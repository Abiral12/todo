const { loginUser } = require('../controllers/userauthController');

const router = require('express').Router();


router.post('/login', loginUser);

module.exports = router;