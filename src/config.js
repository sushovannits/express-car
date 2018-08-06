import dotenv from 'dotenv';

dotenv.load({
  path: '.env',
});

const env = process.env.NODE_ENV; // 'dev' or 'test' or 'production'

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT, 10) || 8000,
    baseUrl: process.env.DEV_HOST_URL || 'http://localhost:8000',
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT, 10) || 27017,
    name: process.env.DEV_DB_NAME || 'db',
  },
};
const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT, 10) || 8000,
    baseUrl: process.env.DEV_HOST_URL || 'http://localhost:8000',
  },
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT, 10) || 27017,
    name: process.env.TEST_DB_NAME || 'testdb',
  },
};
const production = {
  app: {
    port: parseInt(process.env.PRODUCTION_APP_PORT, 10) || 8000,
    baseUrl: process.env.PRODUCTION_HOST_URL || 'http://localhost:8000',
  },
  db: {
    host: process.env.PRODUCTION_DB_HOST || 'mongo',
    port: parseInt(process.env.PRODUCTION_DB_PORT, 10) || 27017,
    name: process.env.PRODUCTION_DB_NAME || 'productiondb',
  },
};

const config = {
  dev,
  test,
  production,
};
export default config[env || 'production'];
