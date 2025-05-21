import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, name || null]
    );

    // Create default social media accounts
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'threads'];
    for (const platform of platforms) {
      await pool.query(
        'INSERT INTO social_media_credentials (id, user_id, platform) VALUES (?, ?, ?)',
        [uuidv4(), userId, platform]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      id: userId,
      email,
      name: name || null,
      token,
      accounts: platforms.map(platform => ({
        platform,
        connected: false
      }))
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await pool.query(
      'SELECT u.*, GROUP_CONCAT(smc.platform) as platforms, GROUP_CONCAT(smc.access_token IS NOT NULL) as connected FROM users u LEFT JOIN social_media_credentials smc ON u.id = smc.user_id WHERE u.email = ? GROUP BY u.id',
      [email]
    );

    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Parse platforms and connected status
    const platforms = user.platforms ? user.platforms.split(',') : [];
    const connected = user.connected ? user.connected.split(',').map((status: string) => status === '1') : [];
    
    const accounts = platforms.map((platform: string, index: number) => ({
      platform,
      connected: connected[index] || false
    }));

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      token,
      accounts
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}; 