const prisma = require('../../config/prisma');
const { hashPassword, comparePassword } = require('../../utils/hash');
const { generateToken } = require('../../utils/jwt');
const analytics = require('../analytics/analytics.service');
const logger = require('../../utils/logger');

const register = async ({ email, username, password }) => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existing) {
    throw new Error('User already exists');
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashed
    }
  });

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    },
    token
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);

  try {
    await analytics.trackEvent({
      type: 'login',
      userId: user.id
    });
  } catch (err) {
    logger.error('Failed to track login analytics event', { error: err.message });
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    },
    token
  };
};

module.exports = { register, login };
