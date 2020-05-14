const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../models/user");

async function home(req, res) {
  try {
    const user = await User.findById(req.userId, { password: 0 });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    return;
  }
}

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    return res.status(400).json({ auth: false, message: "No token provided" });
  }

  const decoded = jwt.verify(token, config.secret);
  req.userId = decoded.id;
  next();
}

async function signup(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ response: "the fields are required" });
  }

  try {
    const user = new User({
      username,
      email,
      password,
    });

    user.password = await user.encryptPassword(password);
    await user.save();

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 900,
    });

    res.status(201).json({ auth: true, token });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

async function emailAvailable(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ response: "the email is already taken" });
    }
  } catch (err) {
    console.error(err);
    return;
  }

  next();
}

async function signin(req, res) {
  const { email, password } = req.body;
  let user, isValidPassword;

  if (!email || !password) {
    return res.status(400).json({ response: "the fields are required" });
  }

  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ response: "invalid credentials" });
    }
    isValidPassword = await user.comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 900,
    });

    res.status(200).json({ auth: true, token });
  } catch (err) {
    console.error(err);
    return;
  }

  res.send("signin");
}

function logout(req, res) {
  res.status(200).json({ auth: false, token: null });
}

module.exports = {
  home,
  signup,
  emailAvailable,
  signin,
  logout,
  verifyToken,
};
