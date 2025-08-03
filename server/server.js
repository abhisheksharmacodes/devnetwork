const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://geekysharma31:bq00TVbJSVw1I5eL@cluster0.urb7jbj.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 }
});

const Post = mongoose.model('Post', postSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/auth/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('bio').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio: bio || ''
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
app.post('/api/posts', authenticateToken, [
  body('content').notEmpty().withMessage('Post content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const post = new Post({
      content,
      author: req.user.userId
    });

    await post.save();
    
    // Populate author info
    await post.populate('author', 'name email');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (feed)
app.get('/api/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const userId = req.user.userId;
    const postsWithInteractions = posts.map(post => {
      const hasLiked = post.likes.includes(userId);
      const hasDisliked = post.dislikes.includes(userId);
      return {
        ...post.toObject(),
        hasLiked,
        hasDisliked
      };
    });

    res.json(postsWithInteractions);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts
app.get('/api/users/:userId/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const currentUserId = req.user.userId;
    const postsWithInteractions = posts.map(post => {
      const hasLiked = post.likes.includes(currentUserId);
      const hasDisliked = post.dislikes.includes(currentUserId);
      return {
        ...post.toObject(),
        hasLiked,
        hasDisliked
      };
    });

    res.json(postsWithInteractions);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a post
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.userId;
    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasLiked) {
      // Unlike if already liked
      post.likes = post.likes.filter(id => id.toString() !== userId);
      post.likeCount -= 1;
    } else {
      // Like and remove from dislikes if previously disliked
      if (hasDisliked) {
        post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
        post.dislikeCount -= 1;
      }
      post.likes.push(userId);
      post.likeCount += 1;
    }

    await post.save();
    res.json({ likeCount: post.likeCount, dislikeCount: post.dislikeCount, hasLiked: !hasLiked, hasDisliked: false });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a post
app.post('/api/posts/:postId/dislike', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.userId;
    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasDisliked) {
      // Remove dislike if already disliked
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
      post.dislikeCount -= 1;
    } else {
      // Dislike and remove from likes if previously liked
      if (hasLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
        post.likeCount -= 1;
      }
      post.dislikes.push(userId);
      post.dislikeCount += 1;
    }

    await post.save();
    res.json({ likeCount: post.likeCount, dislikeCount: post.dislikeCount, hasLiked: false, hasDisliked: !hasDisliked });
  } catch (error) {
    console.error('Dislike post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post interaction status for a user
app.get('/api/posts/:postId/interaction', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.userId;
    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    res.json({
      likeCount: post.likeCount,
      dislikeCount: post.dislikeCount,
      hasLiked,
      hasDisliked
    });
  } catch (error) {
    console.error('Get post interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
