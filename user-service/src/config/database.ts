import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/user.entity';
import { Address } from '../models/address.entity';

// Çevre değişkenlerini yükle
dotenv.config();

// TypeORM bağlantı yapılandırması
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Address],
  synchronize: process.env.NODE_ENV !== 'production', // Sadece geliştirme ortamında
  logging: process.env.NODE_ENV !== 'production',
});