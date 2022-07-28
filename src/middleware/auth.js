const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) 
      return res.status(400).send({ status: false, msg: "token is required" });

    const data = jwt.verify(token, 'Secret-Key-given-by-us-to-secure-our-token');
    
    req.userId = data.userId;

    return next();

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { authorization };