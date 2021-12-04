const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/User');

//GET USER
router.get('/user/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    const { password, createdAt, ...other } = user._doc;
    res.status(200).json({ status: 'success', user: other });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//UPDATE USER
router.put('/user/update/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: 'success', user: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

//DELETE USER
router.delete('/user/delete/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
