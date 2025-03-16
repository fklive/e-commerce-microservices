import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Çevre değişkenlerini yükle
dotenv.config();

// Mongoose bağlantı seçenekleri
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Mongoose bağlantısı
export const connectDB = async () => {
  try {
    const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully.Address:',uri);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};