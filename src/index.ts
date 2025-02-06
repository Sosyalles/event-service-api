import app from './app';
import { Config } from './config/config';
import { initDatabase } from './config/database';

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();

    // Start server
    app.listen(Config.PORT, () => {
      console.log(`Server is running on port ${Config.PORT}`);
      console.log(`Environment: ${Config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 