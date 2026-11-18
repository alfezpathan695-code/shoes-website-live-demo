require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

async function startServer() {
  const { JWT_SECRET, PORT = 5000 } = process.env;
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('Set JWT_SECRET to a private value with at least 32 characters in backend/.env.');
  }

  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Mela API listening on port ${PORT}`);
  });

  function shutdown() {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start the API:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { startServer };
