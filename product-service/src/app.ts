import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { initRedis } from './utils/redis';
import categoryRoutes from './routes/category-routes';

// Express uygulaması oluşturma
const app = express();

// Middleware'leri ekleme
app.use(cors());
app.use(express.json());

// Route'ları tanımlama
app.use('/api/categories', categoryRoutes);

// Ana route
app.get('/', (req, res) => {
  res.send('Product Service API is running');
});

// Veritabanı bağlantısı ve sunucuyu başlatma
const PORT = process.env.PORT || 3002;

// MongoDB bağlantısı
connectDB()
  .then(async () =>  {
    console.log('MongoDB connection established');
    
    // Redis bağlantısını başlat
    try {
      await initRedis();
      console.log('Redis connection established');
    } catch (err) {
      console.error('Redis connection error:', err);
    }
    
    // Server'ı başlat
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export default app;