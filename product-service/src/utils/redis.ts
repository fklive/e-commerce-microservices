import Redis from 'redis';
import { promisify } from 'util';

// Redis istemcisi oluşturma
const redisClient = Redis.createClient({
    socket:{
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});

// Promise tabanlı get ve set metodları
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Ürün önbelleğe alma fonksiyonu
export const cacheProduct = async (productId: string, productData: any): Promise<void> => {
  // 1 saatlik önbellek süresi (saniye cinsinden)
  const CACHE_TTL = 60 * 60;
  
  await setAsync(
    `product:${productId}`, 
    JSON.stringify(productData),
    'EX',
    CACHE_TTL
  );
};

// Önbellekten ürün getirme fonksiyonu
export const getCachedProduct = async (productId: string): Promise<any | null> => {
  const cachedData = await getAsync(`product:${productId}`);
  
  if (!cachedData) return null;
  
  return JSON.parse(cachedData);
};