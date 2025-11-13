using System.Threading.Tasks;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Data
{
    public static class DataSeeder
    {
        public static async Task SeedDefaultAdminAsync(ApplicationDbContext context, IConfiguration configuration)
        {
            var adminSection = configuration.GetSection("DefaultAdmin");
            var email = adminSection["Email"];
            var password = adminSection["Password"];
            var name = adminSection["Name"] ?? "Admin";

            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return;
            }

            var exists = await context.Users.AnyAsync(u => u.Email == email);
            if (exists)
            {
                return;
            }

            var adminUser = new User
            {
                Name = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                IsAdmin = true
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }
    }
}
