const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// In-memory OTP store (swap with Redis in production)
const otpStore = {};

// ── SEND OTP ─────────────────────────────────────────────
const sendOtp = async (req, res) => {
  const { mobileNum } = req.body;
  if (!mobileNum || mobileNum.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[mobileNum] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 mins

  console.log(`[OTP] ${mobileNum} → ${otp}`);

  try {
    // TODO: plug in Twilio here when config is ready
    // await twilioClient.messages.create({ body: `Your LoadBhai OTP: ${otp}`, from: TWILIO_PHONE, to: `+91${mobileNum}` });
    return res.status(200).json({ success: true, message: `[DEV] OTP is: ${otp}` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────
const verifyOtp = (req, res) => {
  const { mobileNum, otpVal } = req.body;
  const record = otpStore[mobileNum];

  if (!record) return res.status(400).json({ verified: false, error: 'OTP not found or expired' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[mobileNum];
    return res.status(400).json({ verified: false, error: 'OTP expired' });
  }
  if (record.otp !== otpVal) {
    return res.status(400).json({ verified: false, error: 'Incorrect OTP' });
  }

  delete otpStore[mobileNum];
  return res.status(200).json({ verified: true });
};

// ── REGISTER ──────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { mobile, role, firstName, lastName, businessName, gst, dl, password } = req.body;

    const exists = await User.findOne({ mobile });
    if (exists) return res.status(409).json({ error: 'Mobile number already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      mobile, role, firstName, lastName,
      businessName, gst, dl,
      password: hashed,
      isVerified: true,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ token, user: _safeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ token, user: _safeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

// ── GET PROFILE ───────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, businessName, dp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, businessName, dp },
      { new: true }
    ).select('-password');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ── HELPER ────────────────────────────────────────────────
const _safeUser = (u) => ({
  id: u._id,
  mobile: u.mobile,
  role: u.role,
  firstName: u.firstName,
  lastName: u.lastName,
  businessName: u.businessName,
  dp: u.dp,
  isVerified: u.isVerified,
});

module.exports = { sendOtp, verifyOtp, register, login, getProfile, updateProfile };
