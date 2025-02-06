import { Sequelize } from 'sequelize';
import { Config } from './config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  database: Config.DB_NAME,
  username: Config.DB_USER,
  password: Config.DB_PASSWORD,
  logging: Config.isDevelopment() ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    if (Config.isDevelopment()) {
      try {
        await sequelize.sync({ 
          force: true,
          alter: false,
        });
        console.log('Database tables have been created successfully.');

      } catch (syncError) {
        console.error('Error during database synchronization:', syncError);
        throw syncError;
      }
    } else {
      console.log(`Database synchronization skipped in ${Config.NODE_ENV} environment.`);
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize; 