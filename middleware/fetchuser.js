// fetchuser is a middleware which is used to get the user details
const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisisasecret";

const fetchuser = (req, res, next) => {
    // here we have three arguments req, res, next, where next is a callback function which is used to call the next middleware function, and this function in this case is function in the getuser route in auth.js

    // get the user from the jwt token and add id to req object

    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    // const string = process.env.JWT_SECRET;
    const string = jwt.verify(token, JWT_SECRET);
    req.user = string.user;

    next();
}

module.exports = fetchuser;