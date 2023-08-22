const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const User = require('../../models/User');

// Register user
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// get user following
router.get('/following', auth, async (req, res) => {
  try {
    let user = await User.findOne({_id: {$in : req.user.id}});
    const userIds = user.follows.map(followed => followed.user);
    return res.json(userIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Follow a user
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id});
    user.follows.unshift({ user: req.params.id });

    await user.save();

    return res.json(user.follows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Unfollow a user
router.put('/unfollow/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id});

    user.follows = user.follows.filter(
      ({ user }) => user.toString() !== req.params.id
    );

    await user.save();

    return res.json(user.follows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
