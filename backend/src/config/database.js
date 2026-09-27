import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
const test = process.env.NODE_ENV === 'test';
const sequelize = test ? new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false }) : new Sequelize(process.env.DB_NAME || 'adcampaign360', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', { host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), dialect: 'mysql', logging: false });
export default sequelize;
