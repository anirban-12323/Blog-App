const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");
const uniqid = require("uniqid");

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "blog-app-f9c1d",
    private_key_id: "101587a601f8cbc2f34d1bf97d99833a7352822e",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdEk+SaonHcuI6\nGCb0L2BKwHc/NOV4KRgYLxuRTNnDSaVL1gu810/ehrafNDVxMYFbpSBed8A4ypSf\nusFB+72BVmsnR5gjC0MHNvT61YFexWWPQVxYxvDJo3icC2TBO3cJFbfj/+KmnM2M\nV1NeZF86KEgocEsuLr9zGe6+5FVvnzoYJxWzJLcAedF+y8eYDYhgnBCH7n6RO8Lb\n00ECkHzXI69ghiwkqK1PNb3d3rc5ZA8Jr03ZqOSn7rZPRBC7GtidxBqmf28K3NPU\nKrQEn9AiuzHQD4OvwRvK9U9gBp9f14kxD9hoxyGxju3NyWNjMt03WtFLjvm+xiMC\n9zAZHbR1AgMBAAECggEAKxYXhhzXj5TXfKUaansVVFxgoWQI2TuBI62CvPXydzpS\nSg6EqSB5w5AT5cGCLPaOFLOBNIg4YZkyEFOQuPB8hcm3BqfQgfv+61gNtRmJplPo\nsFv3yKG1akc/CYK692JEl/OwrHJB1WE4OoMGj54WZTpWnfMM5Apea+uA+Zl9AUz1\nhTzRsbTYU9QVmtMWufDhIMU8mahy5/pjq9EnCbSIlksMar7BbZIJqKUv5/f3cCIH\n2flG/9QqhFAOqG88HVupZKiLQFm0xyWyz2QLOHz15JoUuBkw+m1qPNJjtthe9kV6\nfWfFn6pz1ZaYH++bdGHk5NDdyy1Bx+PWkhPE1xn4YQKBgQDuK6ctbrbm2Rl6lZUo\n5UoLMnU6E2XtGgsvU9fBBgxrMtVgh90Qxqsz7c0dszsUb7cRwNwlkK0ouDOopq93\nsKYkC7yXQAGkCHRwL/N6+53N6lrJ0J27SOWi06qcJXwrop9tfVulUymTFJiN8y8+\nz2VoNtK4EvNE1PShNsVIyTRhbQKBgQDtnvgkbHZuO9ntY+X1cM/5VEPKl6BjHolu\nRLldA/XNj8o3FJBAQimAn0MisuOfay/ixLk+RPOXDI9cnX/Nj0zyS1JK9qLjgQZ7\nymYwi/C+oFs/urOFG4KxI8XoxuUq1R7re4pKYoQiKd79p/sPO4eGJN+CvitAFX+G\nXnToE4xCKQKBgHuRZnEp6fcnWBLDnNnU7G+WxD9XZSB4zKjHZT8eNj8/5njoxIc5\nrAWLMUphfRuDQoYRe6Z5w31G5HZx1MPSgMBe3n/Sk4dZY5/5IOgDt8Hn/yaJ9+v9\nTDcIfpH42M2C2BhkW7IQzZcjrmqnazG5RLGnD/i0zEY//pPN6Nl0mpqZAoGBAM54\n3YE4xcePNhOyRDT665vofmdhTToTZLNt/+s077bIhJtLwPQ1CT78JCfYbTUuvBM9\ngQD8hPTxMvj02gJRzDiU/lKo8GzixjF2c0knr+7UA7Xiku7MMsmdHfDgMmz/driD\nRmzQIaRV4a9i8SIRRfdnvtcqSwaKJ58oIEkwAyXRAoGAQAy1Xomyfr8GDVWWssFJ\n6vbsdNF9322mVtIrfMJ/cXyFX2bEmHT7M0NSiCLUf0GIJP6TgaTVVGXwq8KElmRR\nV4XZ2lwVJwVTdS/ga0bYcvAZ45QQ7TsJuvsFyqnyQYfBwZEVBM0Fc0GRK4yhYtaU\naPO22yVUOf/YgWWEq/+UGgo=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-fbsvc@blog-app-f9c1d.iam.gserviceaccount.com",
    client_id: "105252886072496907833",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40blog-app-f9c1d.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
});

async function googleAuth(req, res) {
  const { accessToken } = req.body;
  const response = await getAuth().verifyIdToken(accessToken);

  const { name, email } = response;

  let user = await User.findOne({ email });

  if (user) {
    //already registered
    if (user.googleAuth) {
      let token = await generateJWT({
        email: user.email,
        id: user._id,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } else {
      return res.status(400).json({
        success: true,
        message:
          "this email is already registered without google,please try through login form",
      });
    }
  }

  let newUser = await User.create({
    name,
    email,
    googleAuth: true,
    isVerify: true,
  });

  let token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
  });

  return res.status(200).json({
    success: true,
    message: "Registered successfully",

    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    },
  });
}

async function createUser(req, res) {
  const { name, email, password } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please enter name",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter password",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    }

    const chekedforexitingUser = await User.findOne({ email });
    if (chekedforexitingUser) {
      if (chekedforexitingUser.googleAuth) {
        return res.status(400).json({
          success: true,
          message:
            "this email is already registered with google,please try through continue with google",
        });
      }
      if (chekedforexitingUser.isVerify) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      } else {
        let verificationToken = await generateJWT({
          email: chekedforexitingUser.email,
          id: chekedforexitingUser._id.toString(),
        });

        //SENDING EMAIL LOGIC
        const sendingEmail = transporter.sendMail({
          from: "anirbanguharoy82@gmail.com",
          to: chekedforexitingUser.email,
          subject: "Email Verification ",
          text: "Please Verify Your Email", // Plain-text version of the message
          html: `<h1>Click on the link to verify your email</h1>
      <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>
      `, // HTML version of the message
        });
        return res.status(200).json({
          success: true,
          message: "Please check your email and verify",
        });
      }
    }

    const hashPass = await bcrypt.hash(password, 12);
    const username =
      email.split("@")[0].toLowerCase().trim() + uniqid().slice(0, 5);
    const newUser = await User.create({
      name,
      email,
      password: hashPass,
      username,
    });
    const newUserObj = newUser.toObject();
    delete newUserObj.password;

    let verificationToken = await generateJWT({
      email: newUserObj.email,
      id: newUserObj._id.toString(),
    });

    //SENDING EMAIL LOGIC
    const sendingEmail = transporter.sendMail({
      from: "anirbanguharoy82@gmail.com",
      to: email,
      subject: "Email Verification ",
      text: "Please Verify Your Email", // Plain-text version of the message
      html: `<h1>Click on the link to verify your email</h1>
      <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>
      `, // HTML version of the message
    });

    return res.status(200).json({
      success: true,
      message: "Please check your email and verify",
      // user: {
      //   id: newUserObj._id,
      //   name: newUserObj.name,
      //   email: newUserObj.email,
      //   token,
      // },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const { verificationToken } = req.params;

    const verifyToken = await verifyJWT(verificationToken);

    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token/Email Expired",
      });
    }

    const { id } = verifyToken;

    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true },
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exit",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter password",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter email",
      });
    }

    const chekedforexitingUser = await User.findOne({ email });
    if (!chekedforexitingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }

    if (chekedforexitingUser.googleAuth) {
      return res.status(400).json({
        success: true,
        message:
          "this email is already registered with google,please try through continue with google",
      });
    }

    let checkForPass = await bcrypt.compare(
      password,
      chekedforexitingUser.password,
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    if (!chekedforexitingUser.isVerify) {
      //sending email logic
      let verificationToken = await generateJWT({
        email: chekedforexitingUser.email,
        id: chekedforexitingUser._id.toString(),
      });

      //SENDING EMAIL LOGIC
      const sendingEmail = transporter.sendMail({
        from: "anirbanguharoy82@gmail.com",
        to: chekedforexitingUser.email,
        subject: "Email Verification ",
        text: "Please Verify Your Email", // Plain-text version of the message
        html: `<h1>Click on the link to verify your email</h1>
      <a href="http://localhost:5173/verify-email/${verificationToken}">Verify Email</a>
      `, // HTML version of the message
      });

      return res.status(400).json({
        success: false,
        message: "Please verify your email",
      });
    }

    let token = await generateJWT({
      email: chekedforexitingUser.email,
      id: chekedforexitingUser._id.toString(),
    });

    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        name: chekedforexitingUser.name,
        email: chekedforexitingUser.email,
        id: chekedforexitingUser._id,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
}

async function getUser(req, res) {
  try {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      message: "user fetch successfully",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "error occur during user fetching",
    });
  }
}

async function getUserBYID(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user fetch successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "error occur during user fetching",
    });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const { name, password, email } = req.body;

    const UpdateUser = await User.findByIdAndUpdate(
      id,
      { name, password, email },
      { new: true },
    );

    if (!UpdateUser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      UpdateUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      message: "error during user update",
    });
  }
}

async function deleteUserByID(req, res) {
  try {
    const id = req.params.id;
    const { name, password, email } = req.body;

    const deletedUser = await User.findByIdAndUpdate(id);

    if (!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
      deletedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Faceing error during deleting the user",
    });
  }
}
//follow/unfollow controller

async function followUsers(req, res) {
  try {
    //id , who follow the creator
    const followerId = req.user.id;
    //the creator id
    const { id } = req.params;

    //here the user is creator
    const user = await User.findById(id);

    if (!user) {
      return res.status(500).json({
        message: "user is not found",
      });
    }

    if (!user.followers.includes(followerId)) {
      await User.findByIdAndUpdate(id, { $set: { followUsers: followerId } });
      await User.findByIdAndUpdate(followerId, { $set: { following: id } });

      return res.status(200).json({
        success: true,
        message: "Follow",
      });
    } else {
      await User.findByIdAndUpdate(id, { $unset: { followUsers: followerId } });
      await User.findByIdAndUpdate(followerId, { $unset: { following: id } });

      return res.status(200).json({
        success: true,
        message: "unfollow",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createUser,
  getUser,
  getUserBYID,
  updateUser,
  deleteUserByID,
  login,
  verifyToken,
  googleAuth,
  followUsers,
};
