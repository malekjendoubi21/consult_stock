using Microsoft.EntityFrameworkCore;
using comsult_stock.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace consult_stock.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Lot> Lots { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Vente> Ventes { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Societe> Societes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Vendeur> Vendeurs { get; set; }
        public DbSet<Administrateur> Administrateurs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
