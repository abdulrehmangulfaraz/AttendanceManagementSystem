using Microsoft.EntityFrameworkCore;

namespace AMS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // We will add DbSet properties here later (e.g., public DbSet<User> Users { get; set; })
    }
}