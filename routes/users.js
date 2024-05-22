const { Router } = require("express");
const User = require("../models/users");

const router = Router();

router.get("/signIn", (req, res) => {
  return res.render("signIn");
});

router.get("/signUp", (req, res) => {
  return res.render("signUp");
});
router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const validateToken = await User.matchPasswordAndGenerateToken(
      email,
      password
    );
    return res.cookie("token", validateToken).redirect("/");
  } catch (e) {
    return res.render("signIn", {
      error: "Incorrect Email Or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

router.post("/signUp", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

module.exports = router;
