import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env files - don't override already set environment variables
// This allows Docker environment variables and CLI vars to take precedence
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: false });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env'), override: false });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env'), override: false });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'logistima',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
