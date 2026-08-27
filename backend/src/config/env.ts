import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',

  JWT_SECRET: process.env.JWT_SECRET || 'deepsta_super_secret_jwt_access_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'deepsta_super_secret_jwt_refresh_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local',
  LOCAL_STORAGE_PATH: path.resolve(__dirname, '../../uploads'),
  STORAGE_BASE_URL: process.env.STORAGE_BASE_URL || 'http://localhost:5000/uploads',

  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || '',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || '',
};
