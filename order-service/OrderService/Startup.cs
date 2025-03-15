using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OrderService.Data;
using OrderService.Services;
using StackExchange.Redis;

namespace OrderService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Servis yapılandırmaları
        public void ConfigureServices(IServiceCollection services)
        {
            // Entity Framework Core context'ini ekle
            services.AddDbContext<OrderDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            // Redis bağlantısını ekle
            services.AddSingleton<IConnectionMultiplexer>(sp =>
                ConnectionMultiplexer.Connect(Configuration.GetConnectionString("Redis")));
            
            // Redis servisini ekle
            services.AddScoped<IRedisService, RedisService>();

            // Controller'ları ekle
            services.AddControllers();

            // Swagger/OpenAPI
           /*  services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Order Service API", Version = "v1" });
            }); */
        }

        // Middleware pipeline yapılandırması
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
              //  app.UseSwagger();
              //  app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Order Service API v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}