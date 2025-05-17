using ProjectManagementApp.Models; // 👈 adjust based on your actual project name
using Microsoft.EntityFrameworkCore;

namespace ProjectManagementApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
    }

}
