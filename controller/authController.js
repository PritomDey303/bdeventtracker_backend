const { json } = require("express");
const People = require("../models/peopleSchema");
const EmailHandler = require("../utilityClasses/EmailHandler");
const JwtHandler = require("../utilityClasses/JwtHandler");
const QueryHandler = require("../utilityClasses/QueryHandler");

//wuery object making
const User = new QueryHandler(People);
//Email object making
const Email = new EmailHandler();
//cloudinaryUploader object
////////////////////////////
//sign up handler
////////////////////////////
async function signup(req, res, next) {
  try {
    const { email, password, username, accountType } = req.body;

    const user = await User.findData({ email: email });
    if (user.length > 0) {
      return res.json({ status: 400, message: "User already exists" });
    } else {
      const hashedPassword = await JwtHandler.hashPassword(password);
      const userObj = {
        email: email,
        password: hashedPassword,
        username: username,
        isVerified: false,
        accountType: accountType,
      };
      const token = await JwtHandler.generateToken(userObj, "1h");
      const body = await Email.verificationEmailBuilder(token);
      const info = await Email.sendEmail(
        email,
        "Verify your email address.",
        body
      );
      const newUser = await User.insertData(userObj);

      return res.json({ status: 200, message: "Verification email sent." });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

///////////////////////////
//sign in handler
///////////////////////////
async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findDataByEmail(email);
    if (!user || !user.isVerified) {
      return res.json({ status: 400, message: "User does not exist" });
    } else {
      const match = await JwtHandler.comparePassword(password, user.password);
      if (match) {
        userObj = {
          email: user.email,
          username: user.username,
          accountType: user.accountType,
          _id: user._id,
        };
        const token = await JwtHandler.generateTokenWithNoExpiration(userObj);
        //setting token into cookie
        // res.cookie(process.env.COOKIE_NAME, token, {
        //   maxAge: 1000 * 60 * 60 * 24,
        //   httpOnly: true,
        //   signed: true,
        // });

        return res.json({
          status: 200,
          message: "Sign in successful.",
          data: userObj,
          token: token,
        });
      } else {
        return res.json({ status: 400, message: "Password is incorrect" });
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}
///////////////////////////
//sign out handler
///////////////////////////
async function signout(req, res, next) {
  try {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.json({ status: 200, message: "Sign out successful." });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}
///////////////////////////
//verify handler
///////////////////////////
async function emailVerification(req, res, next) {
  try {
    const { token } = req.body;
    const decoded = await JwtHandler.verifyToken(token);
    const user = await User.findDataByEmail(decoded.email);
    if (user.isVerified) {
      return res.json({ status: 400, message: "User already verified." });
    } else {
      await User.updateDataByEmail(decoded.email, { isVerified: true });
      //welcome notification

      return res.json({ status: 200, message: "User verified." });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

///////////////////////////
//forgot password handler
///////////////////////////
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findDataByEmail(email);
    if (!user) {
      return res.json({ status: 400, message: "User does not exist" });
    } else {
      const userObj = {
        email: user.email,
        username: user.username,
        _id: user._id,
        accountType: user.accountType,
      };
      const token = await JwtHandler.generateToken(userObj, "1h");
      const body = await Email.forgotPasswordEmailBuilder(token);
      const info = await Email.sendEmail(email, "Reset your password.", body);
      return res.json({ status: 200, message: "Password reset email sent" });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

///////////////////////////
//reset password handler
///////////////////////////
async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const decoded = await JwtHandler.verifyToken(token);
    const user = await User.findDataByEmail(decoded.email);
    if (!user) {
      return res.json({ status: 400, message: "User does not exist" });
    } else {
      const { password } = req.body;
      const hashedPassword = await JwtHandler.hashPassword(password);
      await User.updateDataById(decoded._id, { password: hashedPassword });
      console.log(password);
      return res.json({ status: 200, message: "Password reset successful." });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

///////////////////////////
//change password handler
///////////////////////////
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findDataByEmail(req.user.email);
    if (!user) {
      return res.json({ status: 400, message: "User does not exist" });
    } else {
      const match = await JwtHandler.comparePassword(
        oldPassword,
        user.password
      );
      if (match) {
        const hashedPassword = await JwtHandler.hashPassword(newPassword);
        await User.updateDataById(user._id, { password: hashedPassword });
        return res.json({
          status: 200,
          message: "Password changed successfully.",
        });
      } else {
        return res.json({ status: 400, message: "Password is incorrect" });
      }
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}
///////////////////////////
//keep user logged in using signed  cookies
///////////////////////////
async function checkLogin(req, res, next) {
  try {
    //getting token from headers
    const auth = req.headers.authorization;
    let token = auth.split(" ")[1];

    //console.log(token);
    if (token) {
      const decoded = await JwtHandler.verifyToken(token);

      const user = await User.findDataByEmail(decoded.email);
      if (user) {
        req.user = user;
        return next();
      }
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    return res.redirect("/");
  }
}
///////////////////////////
//check login status
///////////////////////////
async function checkLoginStatus(req, res, next) {
  try {
    const user = await User.findData({ email: req.user.email });
    if (user) {
      console.log(user);
      const userData = {
        email: user[0].email,
        username: user[0].username,
        _id: user[0]._id,
        accountType: user[0].accountType,
      };
      console.log(userData);

      return res.json({
        status: 200,
        message: "User is logged in.",
        data: userData,
      });
    } else {
      return res.json({ status: 400, message: "User is not logged in." });
    }
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

module.exports = {
  signup,
  signin,
  signout,
  emailVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  checkLogin,
  checkLoginStatus,
};
