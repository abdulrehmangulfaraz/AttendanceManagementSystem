using AMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AMS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<AcademicSession> AcademicSessions { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<TeacherAllocation> TeacherAllocations { get; set; }
    }
}