require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const adminRoutes = require('./routes/admin');
const { apiLimiter, adminLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { UPLOAD_DIR } = require('./middleware/upload');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim());

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
}));

// Images uploaded from the admin panel (logos, service photos)
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', index: false, fallthrough: false }));

// Admin API (larger body limit for service page content)
app.use('/api/admin', adminLimiter, express.json({ limit: '300kb' }), adminRoutes);

// Public API
app.use(express.json({ limit: '20kb' }));
app.use('/api', apiLimiter, routes);
app.use('/api', notFound);

// Serve the built React app (website + /admin) from ../frontend/dist when it exists
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(errorHandler);

// In production set HOST=127.0.0.1 so the app is reachable only through Nginx.
const HOST = process.env.HOST || undefined;
app.listen(PORT, HOST, () => console.log(`Srinivasa Dental running on http://${HOST || 'localhost'}:${PORT}`));
