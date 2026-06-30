const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(apiLimiter);

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const projectRoutes = require('./modules/projects/project.routes');
const collabRoutes = require('./modules/collaboration/collab.routes');
const audioRoutes = require('./modules/audio/audio.routes');
const chatRoutes = require('./modules/chat/chat.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const searchRoutes = require('./modules/search/search.routes');
const activityRoutes = require('./modules/activity/activity.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/audio', audioRoutes);
app.use('/api/collaboration', collabRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/feed', activityRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;
