import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import config from "../config/env.js";
import { generateToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const googleClient = new OAuth2Client();

const authResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    avatar: user.avatar,
  },
  token: generateToken(String(user._id)),
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
    });
    return;
  }
  const { name, email, password } = req.body;

  // Check if user exists (normalize case/whitespace — the schema's
  // `lowercase`/`trim` setters only run on save, not on query filters)
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });
  if (existingUser) {
    res.status(400).json({
      error: "User already exists",
    });
    return;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    provider: "credentials",
  });

  res.status(201).json(authResponse(user));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array(),
    });
    return;
  }
  const { email, password } = req.body;

  // Normalize the same way the schema does on save — otherwise a user
  // whose email was stored lowercase (always, via the schema setter) will
  // fail this exact-match query if they type/autofill a different case.
  const normalizedEmail = email.trim().toLowerCase();

  // Find user and include password
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");
  if (!user || !user.password) {
    res.status(401).json({
      error: "Invalid credentials",
    });
    return;
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({
      error: "Invalid credentials",
    });
    return;
  }

  res.json(authResponse(user));
});

// @desc    Sign in or register with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!config.googleClientId) {
    res.status(503).json({
      error: "Google authentication is not configured",
    });
    return;
  }

  if (!credential || typeof credential !== "string") {
    res.status(400).json({
      error: "Google credential is required",
    });
    return;
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error.message);
    res.status(401).json({
      error: "Invalid Google credential",
    });
    return;
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    res.status(401).json({
      error: "Google account email could not be verified",
    });
    return;
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  let user = await User.findOne({
    provider: "google",
    providerId: payload.sub,
  });

  if (!user) {
    user = await User.findOne({ email: normalizedEmail });
  }

  if (user) {
    user.provider = "google";
    user.providerId = payload.sub;
    user.avatar = payload.picture || user.avatar;
    if (!user.name && payload.name) {
      user.name = payload.name;
    }
    await user.save();
  } else {
    user = await User.create({
      name: payload.name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      provider: "google",
      providerId: payload.sub,
      avatar: payload.picture,
    });
  }

  res.json(authResponse(user));
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
});