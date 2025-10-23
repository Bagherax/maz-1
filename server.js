// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This will be the hashed password
  tier: { type: String, default: 'normal' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' } // e.g., 'active', 'sold', 'expired'
});

const Ad = mongoose.model('Ad', adSchema);

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);


// --- Authentication Middleware ---
const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if token is in the correct format 'Bearer <token>'
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is "Bearer <token>"' });
  }
  const token = tokenParts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


// --- API Routes ---

// --- Auth Routes ---
// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const payload = { user: { id: user.id, username: user.username, tier: user.tier }};
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// --- Ad Routes ---
// 1. Create a new Ad (Protected Route)
app.post('/api/ads', auth, async (req, res) => {
  try {
    const { title, description, price, images, category } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields for the ad.' });
    }
    const newAd = new Ad({
      title,
      description,
      price,
      images,
      category,
      seller: req.user.id
    });
    const ad = await newAd.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error('Create Ad error:', error);
    res.status(500).json({ message: 'Server error while creating ad.' });
  }
});

// 2. Get all Ads (Public Route)
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('seller', 'username tier isVerified') // Populate seller info, exclude sensitive data
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(ads);
  } catch (error) {
    console.error('Get Ads error:', error);
    res.status(500).json({ message: 'Server error while fetching ads.' });
  }
});

// 3. Get a single Ad by ID (Public Route)
app.get('/api/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('seller', 'username email tier isVerified');
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found.' });
    }
    res.json(ad);
  } catch (error) {
    console.error('Get Ad by ID error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Ad not found.' });
    }
    res.status(500).json({ message: 'Server error while fetching ad.' });
  }
});

// --- Chat Routes ---
// 1. Create a new chat
app.post('/api/chats', auth, async (req, res) => {
  try {
    const { participants } = req.body; // Expecting an array of other participant IDs
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'Participants are required.' });
    }

    const allParticipants = [...new Set([...participants, req.user.id])];

    // For 1-on-1 chats, check if a conversation already exists
    if (allParticipants.length === 2) {
      const existingChat = await Chat.findOne({
        participants: { $all: allParticipants, $size: 2 }
      });
      if (existingChat) {
        return res.status(200).json(existingChat);
      }
    }

    const newChat = new Chat({ participants: allParticipants });
    const savedChat = await newChat.save();
    await savedChat.populate('participants', 'username tier');
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Create Chat error:', error);
    res.status(500).json({ message: 'Server error while creating chat.' });
  }
});

// 2. Get all chats for the logged-in user
app.get('/api/chats', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'username tier')
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Get User Chats error:', error);
    res.status(500).json({ message: 'Server error while fetching user chats.' });
  }
});

// 3. Get messages for a specific chat
app.get('/api/chats/:id/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
                            .populate('messages.sender', 'username');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    if (!chat.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: 'User not authorized to view this chat.' });
    }
    res.json(chat.messages);
  } catch (error) {
    console.error('Get Messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages.' });
  }
});

// 4. Post a message to a chat
app.post('/api/chats/:id/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Message text is required.' });
    }
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    if (!chat.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({ message: 'User not authorized to post in this chat.' });
    }
    const newMessage = {
      sender: req.user.id,
      text: text,
      timestamp: new Date()
    };
    chat.messages.push(newMessage);
    await chat.save();
    
    // To return the populated message, we need to populate the sender of the new message
    const populatedChat = await chat.populate('messages.sender', 'username');
    const sentMessage = populatedChat.messages[populatedChat.messages.length - 1];
    
    res.status(201).json(sentMessage);
  } catch (error) {
    console.error('Post Message error:', error);
    res.status(500).json({ message: 'Server error while posting message.' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
