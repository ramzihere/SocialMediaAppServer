const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//REGISTER
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user &&
      res.status(404).json({ status: 'error', message: 'User not found' });

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validatePassword &&
      res.status(400).json({ status: 'error', message: 'Invalid password' });

    res.status(200).json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
