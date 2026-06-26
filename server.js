const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Load = require('./models/Load');
const User = require('./models/User');

let dbConnected = false;
// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loadbhai').then(() => {
  console.log('MongoDB Connected to LoadBhai DB');
  dbConnected = true;
}).catch(err => console.log('MongoDB Connection Error (Falling back to Local Storage): ', err.message));

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
const PORT = process.env.PORT || 5000; 

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3000',
    'https://loadbhai-logistics.surge.sh',
    'http://loadbhai-logistics.surge.sh'
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

const otpStorage = {};
const memoryLoads = [
  { id: 'LOD-9921', origin: 'Patna, BR', dest: 'Mumbai, MH', material: 'Agricultural Goods', weight: '12 Tons', price: '₹45,000', status: 'active', postedAt: '2 hours ago' },
  { id: 'LOD-8834', origin: 'Delhi, DL', dest: 'Bangalore, KA', material: 'Electronics', weight: '8 Tons', price: '₹62,000', status: 'active', postedAt: '5 hours ago' }
];

app.post('/api/auth/send-otp', async (req, res) => {
  const { mobileNum } = req.body;
  if (!mobileNum || mobileNum.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit Indian Mobile Number required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStorage[mobileNum] = otp;
  console.log(`[LoadBhai Core] Generated Security Token: ${otp} for phone matrix: ${mobileNum}`);

  try {
    if (twilioClient) {
      await twilioClient.messages.create({
        body: `\n[LoadBhai Logistics]\nRam Ram Bhai!\n\nSecurity Gatekeeper Token: ${otp}\nValid for 10 minutes only. Please do not share this token.`,
        from: twilioNumber,
        to: `+91${mobileNum}`
      });
      return res.status(200).json({ success: true, message: `OTP sent successfully to real device!` });
    } else {
      throw new Error("No Twilio Client");
    }
  } catch (error) {
    return res.status(200).json({ 
      success: true, 
      message: `[SANDBOX INTERCEPT] Aapka Code hai: ${otp}` 
    });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { mobileNum, otpVal } = req.body;
  if (otpStorage[mobileNum] && otpStorage[mobileNum] === otpVal) {
    delete otpStorage[mobileNum];
    return res.status(200).json({ verified: true });
  } else {
    return res.status(400).json({ verified: false, error: 'Galat OTP hai Bhai!' });
  }
});

app.get('/api/loads', async (req, res) => {
  try {
    if (dbConnected) {
      const loads = await Load.find().sort({ createdAt: -1 });
      return res.status(200).json(loads.length > 0 ? loads : memoryLoads);
    }
    return res.status(200).json(memoryLoads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loads' });
  }
});

app.post('/api/loads', async (req, res) => {
  try {
    const { origin, dest, material, weight, price } = req.body;
    const newLoadData = {
      id: `LOD-${Math.floor(Math.random() * 90000) + 10000}`,
      origin, dest, material, weight, price, postedAt: 'Just now'
    };
    
    if (dbConnected) {
      const newLoad = new Load(newLoadData);
      await newLoad.save();
      return res.status(201).json(newLoad);
    } else {
      memoryLoads.unshift(newLoadData);
      return res.status(201).json(newLoadData);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create load', details: err.message });
  }
});

app.post('/api/ai/chat', (req, res) => {
  const { userMessage } = req.body;
  return res.status(200).json({ reply: `Bhai, AI server abhi load le raha hai. Tumne poocha: "${userMessage}"` });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LoadBhai Backend Server Fire Grid Engine Up On Port ${PORT}`);
});