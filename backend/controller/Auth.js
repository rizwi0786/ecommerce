const { User } = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotEnv=require("dotenv")

dotEnv.config({path:"./.env"});

exports.createUser = async (req, res) => {
  let salt = await bcrypt.genSalt(10);
  let mod_pass = await bcrypt.hash(req.body.password, salt);
  // console.log("password:",mod_pass);
  const user = new User({ ...req.body, password: mod_pass });
  try {
    const doc = await user.save();

    res.status(201).json({ id: doc.id, role: doc.role });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.body.email },
    ).exec();
    // TODO: this is just temporary, we will use strong password auth
    console.log({ user })
    if (!user) {
      res.status(401).json({ message: 'no such user email' });
    } else if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json({ id: user.id, role: user.role });
    } else {
      res.status(401).json({ message: 'invalid credentials' });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
