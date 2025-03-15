using StackExchange.Redis;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using OrderService.Models;

namespace OrderService.Services
{
    public interface IRedisService
    {
        Task<Cart> GetCartAsync(string key);
        Task SetCartAsync(string key, Cart cart, TimeSpan? expiry = null);
        Task RemoveCartAsync(string key);
    }

    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IDatabase _database;

        public RedisService(IConnectionMultiplexer redis)
        {
            _redis = redis;
            _database = redis.GetDatabase();
        }

        public async Task<Cart> GetCartAsync(string key)
        {
            var value = await _database.StringGetAsync($"cart:{key}");
            if (value.IsNullOrEmpty)
            {
                return null;
            }

            return JsonSerializer.Deserialize<Cart>(value);
        }

        public async Task SetCartAsync(string key, Cart cart, TimeSpan? expiry = null)
        {
            var value = JsonSerializer.Serialize(cart);
            await _database.StringSetAsync($"cart:{key}", value, expiry);
        }

        public async Task RemoveCartAsync(string key)
        {
            await _database.KeyDeleteAsync($"cart:{key}");
        }

        // RedisService sınıfına ek metotlar
        public async Task AddCartItemAsync(string cartId, CartItem item)
        {
            var itemJson = JsonSerializer.Serialize(item);
            await _database.HashSetAsync($"cart:{cartId}:items", item.Id.ToString(), itemJson);
            // Sepet süresini 24 saat olarak ayarla
            await _database.KeyExpireAsync($"cart:{cartId}:items", TimeSpan.FromHours(24));
        }

        public async Task<List<CartItem>> GetCartItemsAsync(string cartId)
        {
            var hashEntries = await _database.HashGetAllAsync($"cart:{cartId}:items");
            if (hashEntries.Length == 0)
            {
                return new List<CartItem>();
            }

            var items = new List<CartItem>();
            foreach (var entry in hashEntries)
            {
                var item = JsonSerializer.Deserialize<CartItem>(entry.Value);
                items.Add(item);
            }
            return items;
        }

        public async Task RemoveCartItemAsync(string cartId, string itemId)
        {
            await _database.HashDeleteAsync($"cart:{cartId}:items", itemId);
        }

    }
}