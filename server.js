const express = require('express');
const cors = require('cors');

// Twilio Parameters
const accountSid = 'ACfb86c5620855a632aabe4850f1af12b7';
const authToken = 'ae82de24094e4f79cebd50df84c80d46';
const twilioNumber = '+17017608371'; 

let twilioClient;
try {
  twilioClient = require('twilio')(accountSid, authToken);
} catch (e) {
  console.log("Twilio init failed, running in sandbox mode.");
}

const app = express();
// Render environment port set karta hai, nahi toh 5000
const PORT = process.env.PORT || 5000; 

// 🔥 CORS UPDATED FOR SURGE LIVE DEPLOYMENT
app.use(cors({
  origin: [
    'http://localhost:5173', // Laptop test ke liye
    'http://localhost:3000',
    'https://loadbhai-logistics.surge.sh', // Tumhara Naya Live link
    'http://loadbhai-logistics.surge.sh'
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

const otpStorage = {};
let loadsList = [];

// ======================================================
// 🚀 SMART PRODUCTION ROUTE: REAL DISPATCH + INSTANT BYPASS
// ======================================================
app.post('/api/auth/send-otp', async (req, res) => {
  const { mobileNum } = req.body;
  if (!mobileNum || mobileNum.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit Indian Mobile Number required' });
  }

  // 4-digit random code generation
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStorage[mobileNum] = otp;

  console.log(`\n======================================================`);
  console.log(`[LoadBhai Core] Generated Security Token: ${otp} for phone matrix: ${mobileNum}`);
  console.log(`======================================================\n`);

  try {
    // Attempt sending real SMS via Twilio pipeline
    await twilioClient.messages.create({
      body: `\n[LoadBhai Logistics]\nRam Ram Bhai!\n\nSecurity Gatekeeper Token: ${otp}\nValid for 10 minutes only. Please do not share this token.`,
      from: twilioNumber,
      to: `+91${mobileNum}`
    });

    console.log(`[LoadBhai Gateway] Real SMS routed successfully via Twilio grid.`);
    // Response for verified numbers
    return res.status(200).json({ success: true, message: `OTP sent successfully to real device!` });

  } catch (error) {
    console.log(`\n⚠️ [Twilio Restriction Bypass] Number unverified on console. Triggering Smart Local Fallback Mode...`);
    
    // 🔥 THE ULTIMATE HACK: Send back the OTP in response message so frontend can show it in alert!
    return res.status(200).json({ 
      success: true, 
      message: `[SANDBOX INTERCEPT] Bhai, Twilio trial account restriction bypass active! Aapka Code hai: ${otp}` 
    });
  }
});

// ======================================================
// 🔑 VERIFICATION ROUTE
// ======================================================
app.post('/api/auth/verify-otp', (req, res) => {
  const { mobileNum, otpVal } = req.body;
  console.log(`[LoadBhai Verification Trigger]: Validating code ${otpVal}`);
  
  if (otpStorage[mobileNum] && otpStorage[mobileNum] === otpVal) {
    delete otpStorage[mobileNum];
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ verified: false, error: 'Galat OTP hai Bhai!' });
  }
});

// ======================================================
// 🚛 LOADS ROUTE
// ======================================================
app.get('/api/loads', (req, res) => { return res.status(200).json(loadsList); });
app.post('/api/loads', (req, res) => {
  const newLoad = { id: `LOD-${Date.now()}`, ...req.body };
  loadsList.unshift(newLoad);
  return res.status(201).json(newLoad);
});

// ======================================================
// 🤖 AI CHATBOT ROUTE (Frontend me error na aaye)
// ======================================================
app.post('/api/ai/chat', (req, res) => {
  const { userMessage } = req.body;
  return res.status(200).json({ reply: `Bhai, AI server abhi load le raha hai. Tumne poocha: "${userMessage}"` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LoadBhai Backend Server Fire Grid Engine Up On Port ${PORT}`);
});