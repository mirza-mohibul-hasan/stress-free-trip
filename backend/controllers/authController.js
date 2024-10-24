const User = require("../models/User");
const appError = require("../utils/appError");
const { generateToken } = require("../utils/authToken");
const generateOTP = require("../utils/generateOtp");
const { hashPassword, matchPassword } = require("../utils/hashedPassword");
const transporter = require("../utils/transporter");

const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // find user by email
    const userFound = await User.findOne({
      email,
    });
    if (userFound) {
      return next(appError("User already exists", 400));
    }

    // hash password
    const hash = await hashPassword(password);

    // save user to the database
    const user = await User.create({
      name,
      email,
      password: hash,
    });

    const otp = generateOTP().otp;
    req.session.otp = otp;
    req.session.user_id = user._id;
    console.log("create", req.session);
    const mailOptions = {
      from: "ecosyncninjas@gmail.com",
      to: email,
      subject: "[Stress Free Trip] Confirm your Stress Free Trip registration",
      html: `
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #007bff;
            }
            p {
              margin-bottom: 20px;
            }
            .otp-code {
              background-color: #007bff;
              color: #fff;
              font-size: 24px;
              padding: 10px 20px;
              border-radius: 5px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hi there!</h1>
            <P>Thanks for registering with Stress Free Trip!</p>
            <p>We received a request to register your account. To proceed, please use the OTP provided below:</p>
            <div class="otp-code">${otp}</div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Thank you,<br/>The Stress Free Trip Team</p>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "failed", msg: "Failed to send OTP email" });
      } else {
        console.log("Email sent: " + info.response);
        // console.log(req.session);
        res.json({ status: "success", msg: "OTP sent successfully" });
      }
    });

    res.json({
      status: "success",
      msg: "Registration Successful",
      data: {
        user_id: user._id,
        user_name: user.fullname,
        user_email: user.email,
      },
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.varify) {
      return next(appError("Invalid Login Credentials", 406));
    }

    // match the user password
    const matched = await matchPassword(password, user.password);
    if (!matched) {
      return next(appError("Invalid Login Credentials", 406));
    }

    // generate login token
    const token = generateToken(user._id);
    if (!token) {
      return next(appError("Failed to generate token", 500));
    }

    res.json({
      status: "success",
      msg: "Login Successful",
      data: {
        user_email: user.email,
        token,
      },
    });
  } catch (error) {
    next(appError(error.message, 500));
  }
};

const varifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    console.log(req.session);
    if (otp === JSON.stringify(req.session.otp)) {
      const user = await User.findByIdAndUpdate(req.session.user_id, {
        varify: true,
      });

      req.session.destroy();
      return res.json({
        status: "success",
        msg: "Email Confirmed",
      });
    } else {
      return next(appError("Invalid OTP", 502));
    }
  } catch (error) {
    next(appError(err.message, 500));
  }
};

module.exports = { userRegister, userLogin, varifyOTP };
