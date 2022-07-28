
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const UserModel = require("../Model/userModel");




// validation start

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


// register_User
//////////////////////////////////////////////////////////////////////////////
const register_User = async (req, res) => {
  try {
    if (!isValidRequestBody(req.body))
      return res.status(400).send({
        status: false,
        msg: "Invalid request parameters, please provide user details",
      });

    const { fName, lName, email_id, password } = req.body;

   
    if (!isValid(fName)) {
      return res
        .status(400)
        .send({ status: false, msg: "First name is required" });
    }
    
    if (!isValid(lName)) {
      return res
        .status(400)
        .send({ status: false, msg: "First name is required" });
    }
    

    if (!/^[a-zA-Z]+$/.test(lName))
      return res
        .status(400)
        .send({ status: false, msg: "last name should be string" });

    if (!isValid(email_id))
      return res.status(400).send({ status: false, msg: "email_id is required" });

    let isemail_id_Used = await UserModel.findOne({ email_id });

    if (isemail_id_Used)
      return res
        .status(400)
        .send({ status: false, msg: `${email_id} already exists` });

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id))
      return res
        .status(400)
        .send({ status: false, message: "Invalid email_id id." });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    if (password.length < 10 || password.length > 15)
      return res
        .status(400)
        .send({ status: false, msg: "password length be between 8-15" });

    let hasedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      fName,
      lName,
      email_id,
      password: hasedPassword,
    };

    let user = await UserModel.create(newUser);
    return res
      .status(201)
      .send({ status: true, message: "User created successfully", data: user });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//Login_user
const login_User = async (req, res) => {
  try {
    if (!isValidRequestBody(req.body))
      return res.status(400).send({
        status: false,
        message: "Invalid parameters ,please provide email_id and password",
      });

    let { email_id, password } = req.body;

    if (!isValid(email_id))
      return res.status(400).send({
        status: false,
        message: "email_id is required",
      });

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email_id))
      return res.status(400).send({
        status: false,
        message: `email_id should be a valid email_id address`,
      });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "password is required" });

    if (password.length < 10 || password.length > 15)
      return res
        .status(400)
        .send({ status: false, msg: "password length be btw 8-15" });

    if (email_id && password) {
      let User = await UserModel.findOne({ email_id: email_id });
      if (!User)
        return res
          .status(400)
          .send({ status: false, msg: "email_id does not exist" });

      let decryppasss = await bcrypt.compare(password, User.password);

      if (decryppasss) {
        const Token = jwt.sign(
          {
            userId: User._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (10 * 60 * 60)
          },
          "Secret-Key-given-by-us-to-secure-our-token"
        );

        return res
          .cookie("access_token", Token, {
            httpOnly: true,
          })
          .status(200)
          .send({
            message: "Logged in successfully",
            data: { userId: User._id, token: Token },
          });
      } else
        return res.status(400).send({ status: false, Msg: "Invalid password" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


// Logout_user

const logout_User = (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .send({ message: "Successfully logged out" });
};


//reset_password

const resetPassword = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.userId))
      return res
        .status(400)
        .send({ status: false, message: `${userId} is invalid` });

    const userFound = await UserModel.findOne({ _id: req.params.userId });

    if (!userFound)
      return res
        .status(404)
        .send({ status: false, message: `User do not exists` });

     if (req.params.userId.toString() !== req.userId)
     return res.status(401).send({
     status: false,
     message: `UnAuthorized access to user`,
    });

    if (!isValidRequestBody(req.body))
      return res
        .status(400)
        .send({ status: false, message: "Please provide details to update" });

    let { password } = req.body;

    let updateUserData = {};

    if (password.length < 10 || password.length > 15)
    return res
      .status(400)
      .send({ status: false, msg: "password length be btw 10-15" });

    if (isValid(password)) {
      const encryptPass = await bcrypt.hash(password, saltRounds);
      updateUserData["password"] = encryptPass;
    }

    const updatedUserData = await UserModel.findOneAndUpdate(
      { _id: req.params.userId },
      updateUserData,
      { new: true }
    );

    return res
      .status(201)
      .send({
        status: true,
        msg: "password reset successfully",
        data: updatedUserData,
      });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};



module.exports = { register_User, login_User, logout_User, resetPassword };