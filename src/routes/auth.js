const express = require("express");
const User = require("../model/user");
const { validateSignUpData } = require("../../utils/validation");
const bcrypt = require("bcrypt");
// const cookies = require("cookie-parser")

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    console.log(passwordHash);
    validateSignUpData(req);
    const user = new User(req.body);
    await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    });
    return res.json({ message: "User added successfully", user });
  } catch (err) {
    return res.status(500).send("Failed to add user" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });
  if (!user) {
    res.status(500).send("Invalid credentials");
  }
  isCorrectPassword = await user.validatePassword(password);
  if (isCorrectPassword) {
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.json({ message: "User logged in successfully", user });
  }
  return res.status(500).send("Invalid credentials");
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("logged out successfully");
});

module.exports = authRouter;
