const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const { generateJWT, verifyJWT } = require("../utils/generateToken");
const transporter = require("../utils/transporter");
const uniqid = require("uniqid");

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const {
  deleteImagefromCloudinary,
  uploadImage,
} = require("../utils/uploadImage");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  FIREBASE_UNIVERSAL_DOMAIN,
  EMAIL_USER,
  FRONTEND_URL,
  FIREBASE_TYPE,
} = require("../config/dotenv.config");

admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: FIREBASE_UNIVERSAL_DOMAIN,
  }),
});

async function googleAuth(req, res) {
  try {
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
            username: user.username,
            showLikedBlogs: user.showLikedBlogs,
            showSavedBlogs: user.showSavedBlogs,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
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
    const username =
      email.split("@")[0].toLowerCase().trim() + uniqid().slice(0, 5);

    let newUser = await User.create({
      name,
      email,
      username,
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
        username: newUser.username, // ✅ FIX
        showLikedBlogs: newUser.showLikedBlogs,
        showSavedBlogs: newUser.showSavedBlogs,
        bio: newUser.bio,
        followers: newUser.followers,
        following: newUser.following,
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
          from: EMAIL_USER,
          to: chekedforexitingUser.email,
          subject: "Email Verification ",
          text: "Please Verify Your Email", // Plain-text version of the message
          html: `<h1>Click on the link to verify your email</h1>
      <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
      `, // HTML version of the message
        });
        return res.status(200).json({
          success: true,
          message: "Please check your email and verify your account",
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
      from: EMAIL_USER,
      to: email,
      subject: "Email Verification ",
      text: "Please Verify Your Email", // Plain-text version of the message
      html: `<h1>Click on the link to verify your email</h1>
      <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
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
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
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

    const chekedforexitingUser = await User.findOne({ email }).select(
      "password isVerify name email profilePic username bio showLikedBlogs showSavedBlogs followers following googleAuth",
    );
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
        from: EMAIL_USER,
        to: chekedforexitingUser.email,
        subject: "Email Verification ",
        text: "Please Verify Your Email", // Plain-text version of the message
        html: `<h1>Click on the link to verify your email</h1>
      <a href="${FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
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
        profilepic: chekedforexitingUser.profilepic,
        username: chekedforexitingUser.username,
        bio: chekedforexitingUser.bio,
        showLikedBlogs: chekedforexitingUser.showLikedBlogs,
        showSavedBlogs: chekedforexitingUser.showSavedBlogs,

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
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate(
        "blogs followers following  likeBlogs  saveBlogs showSavedBlogs",
      )
      .populate({
        path: "followers  following",
        select: "name username",
      })
      .select("-isVerify -password");

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

    const { name, username, bio } = req.body;

    const image = req.file;

    const user = await User.findById(id);

    if (!req.body.profilepic) {
      if (user.profilepicId) {
        await deleteImagefromCloudinary(user.profilepicId);
      }
      user.profilepic = null;
      user.profilepicId = null;
    }

    if (image) {
      if (user.profilepicId) {
        await deleteImagefromCloudinary(user.profilepicId);
      }

      const uploadResult = await uploadImage(image.buffer);
      if (!uploadResult) {
        return res.status(500).json({
          message: "Cover image upload failed",
        });
      }
      const { secure_url, public_id } = await uploadResult;

      user.profilepic = secure_url;
      user.profilepicId = public_id;
    }

    if (user.username !== username) {
      const findUser = await User.findOne(username);

      if (findUser) {
        return res.status(400).json({
          success: false,
          message: "username is already taken",
        });
      }
    }

    user.username = username;
    user.bio = bio;
    user.name = name;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        profilepic: user.profilepic,
      },
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
      await User.findByIdAndUpdate(id, { $set: { followers: followerId } });
      await User.findByIdAndUpdate(followerId, { $set: { following: id } });

      return res.status(200).json({
        success: true,
        message: "Follow",
      });
    } else {
      await User.findByIdAndUpdate(id, { $unset: { followers: followerId } });
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

async function updateBlogVisibilitySettings(req, res) {
  try {
    const userId = req.user.id;

    const { showLikedBlogs, showSavedBlogs } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { showSavedBlogs, showLikedBlogs },
      { new: true },
    );

    return res.status(200).json({
      message: "Visibility updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlogVisibility(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "showLikedBlogs  showSavedBlogs",
    );

    res.status(200).json({
      showSavedBlogs: user.showSavedBlogs,
      showLikedBlogs: user.showLikedBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch settings",
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
  updateBlogVisibilitySettings,
  getBlogVisibility,
};
