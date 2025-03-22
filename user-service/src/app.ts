import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import userRoutes from './routes/user-routes';

// Express uygulaması oluşturma
const app = express();

// Middleware'leri ekleme
app.use(cors());
app.use(express.json());

// Route'ları tanımlama
app.use('/api/users', userRoutes);

// Ana route
app.get('/', (req, res) => {
  res.send('User Service API is running');
});

// Veritabanı bağlantısı ve sunucuyu başlatma
const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

export default app;