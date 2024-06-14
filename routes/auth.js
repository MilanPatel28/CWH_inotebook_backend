const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "thisisasecret";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
// Create a note using: POST "/api/auth/createuser". Doesn't require Auth
router.post("/createuser", [
  // here we are validating the data entered by the user
  body("name", "Name cannot be blank").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
], async (req, res) => {
  let success = false;
  console.log(req.body);
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req); // this variable stores the errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

  // Creating a new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,
  });

  const data = {
    user: {
      id: user.id,
    },
  };

  const authToken = jwt.sign(data, JWT_SECRET);

  jwt.sign({ user: user.id }, JWT_SECRET, (err, authToken) => {
    if (err) {
      res.status(500).send({ success, error: "Internal Server Error" });
    }
  });
  success = true;
  res.json({ success, authToken});
});

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // here we are validating the data entered by the user
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req); // this variable stores the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: get loggedin user details using: POST "/api/auth/getuser". Login required
// here we are using fetchuser middleware to get the user details
// here we to send the jwt token in the header of the request
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // here we are not selecting the password
    // when we send the data using "const data {id: user.id}" - id of the user is already present in the token so we can access it using req.user.id
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
