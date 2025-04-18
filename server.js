const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const Quote = require("./models/quotes.js");
const User = require("./models/user.js");
const cors = require("cors");
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 3000;


// ----------------------------------------------------[[ Connect to DB first]]----------------------------
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ----------------------------------------------------[[ Setup ]]---------------------------------------
const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // This is needed for authentication to work (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// SESSIONS
app.use(
  session({
    secret: process.env.SESSION_SECRET || "General_Assembly_Bootcamp",
    resave: false,
    saveUninitialized: false, // When its true it ensures session object is initialized
    cookie: { 
      secure: false, // Set to `true` if using HTTPS
      sameSite: 'lax', // 'lax' is allowing for cookies from external sites
      httpOnly: true, // this prevents JavaScript from accessing cookies
      maxAge: 24 * 60 * 60 * 1000 // Set cookie expiration (e.g., 1 day)
    }, 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // this parses form data

// ----------------------------------------------------[[ Routes ]]---------------------------------------
// TEST
app.get("/ping", async (req, res) => {
  res.json({message: "Pong!"})
});

// .POST creating a new quote in the database/API
app.post("/quotes", async (req, res) => {
  const createdQuote = await Quote.create(req.body);
  res.json(createdQuote);
});

//.GET a route to find all quote
app.get("/quotes", async (req, res) => {
  const findQuote = await Quote.find();
  res.json(findQuote);
});
// .GET a single quote
app.get("/quote/:quoteId", async (req, res) => {
  const findQuote = await Quote.find({_id: req.params.quoteId});
  res.json(findQuote);
});

//.PUT route for updating quote in  the database
app.put("/quote/:quoteId", async (req, res) => {
  const updatedQuote = await Quote.findByIdAndUpdate(
    req.params.quoteId,
    req.body,
    { new: true }
  );
  res.json({updatedQuote});
});

//.DELETE route to delete quote data from database.
app.delete("/quote/:quoteId", async (req, res) => {
  const deleteQuote = await Quote.findByIdAndDelete(req.params.quoteId);
  res.json(deleteQuote);
});

// AUTH
app.post("/auth/register", async (req, res) => { // Register
  const { username, password } = req.body || {};
  const errors = [];

  // Do validations here making sure username and password was provided in the request
  if (!username) {
    errors.push(`"Username" not provided!`);
  }
  if (!password) {
    errors.push(`"Password" not provided!`);
  }

  // Check if there's any errors
  if (errors.length > 0) {
    return res
      .status(401)
      .json({
        message: "Unable to register. Check error",
        error: errors.join(","),
      });
  }

  // Try to find a user by their username, case-insensitively
  const userFound = await User.findOne({
    username: username, // Search for the exact username
  })
    // Apply case-insensitive search using collation
    .collation({
      locale: "en", // Use English language rules for the comparison
      strength: 2, // Ignore case differences (e.g., 'abc' == 'ABC')
    });

  if (!userFound) {
    const new_user_hashed_password = await bcrypt.hash(password, 5);
    const newUser = await User.create({
      username,
      password_hash: new_user_hashed_password,
    });

    return res.json({
      message: "User sucessfully registered!",
      registeredUser: newUser,
    });
  } else {
    return res
      .status(401)
      .json({
        message: "Unable to register. Check error",
        error: "User already exists",
      });
  }
});

app.post("/auth/login", async (req, res) => {// Login
  const { username, password } = req.body || {};
  const errors = [];

  // Do validations here making sure username and password was provided in the request
  if (!username) {
    errors.push(`"Username" not provided!`);
  }
  if (!password) {
    errors.push(`"Password" not provided!`);
  }

  // Check if there's any errors
  if (errors.length > 0) {
    return res
      .status(401)
      .json({
        message: "Unable to login. Check error",
        error: errors.join(","),
      });
  }

  // Try to find a user by their username, case-insensitively
  const userFound = await User.findOne({
    username: username, // Search for the exact username
  })
    // Apply case-insensitive search using collation
    .collation({
      locale: "en", // Use English language rules for the comparison
      strength: 2, // Ignore case differences (e.g., 'abc' == 'ABC')
    });

  if (userFound) {
    const user_hashed_password = userFound.password_hash;
    const passwordMatches = await bcrypt.compare(
      password,
      user_hashed_password
    );

    // If the password the user inputs matches with the stored/saved password
    if (passwordMatches) {
      const userSession = { id: userFound._id, username: userFound.username };

      req.session.user = userSession; // Save user in session

      return res.json({
        message: "User successfully logged in!",
        session: userSession,
      });
    } else {
      return res
        .status(401)
        .json({
          message: "Unable to login. Check error",
          error: "Invalid credentails",
        });
    }
  } else {
    return res
      .status(401)
      .json({
        message: "Unable to login. Check error",
        error: "User not found",
      });
  }
});

app.post("/auth/logout", async (req, res) => { // Log out
  req.session.destroy(); // destroy session
  return res.json({message: "User sucessfully logged out!"})
});

app.get("/auth/session", async (req, res) => { // Login
  const user_session = req.session.user;

  if (user_session) {
    res.status(201).json({message: "session found!", session: user_session});
  } else {
    res.status(201).json({message: "session not found! :(", session: undefined});
  }
});

// ----------------------------------------------------[[ Start server ]]---------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
