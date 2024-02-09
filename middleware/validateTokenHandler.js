const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    // Splitting the token into two parts with the space and taking the second part which includes the token
    token = authHeader.split(" ")[1];

    // Verifying the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Admin is not authorized" });
      }

      
      // If the user is authorized, take the info of the user and storing it in req.admin
      req.user = decoded.user;
      console.log(req.user);
      // Append in the request body
      next();
    });
  } else {
    res.status(401).json({ message: "Admin is not authorized or token is missing" });
  }
  
});

module.exports = validateToken;
