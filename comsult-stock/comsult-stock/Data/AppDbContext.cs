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

            // Configuration des relations Article-Lot
            modelBuilder.Entity<Lot>()
                .HasOne(l => l.Article)
                .WithMany(a => a.Lots)
                .HasForeignKey(l => l.ArticleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Stock-Societe
            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Societe)
                .WithMany(soc => soc.Stocks)
                .HasForeignKey(s => s.SocieteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Stock-Article (optionnelle)
            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Article)
                .WithMany(a => a.Stocks)
                .HasForeignKey(s => s.ArticleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Stock-Lot (optionnelle)
            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Lot)
                .WithMany(l => l.Stocks)
                .HasForeignKey(s => s.LotId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Vente-Societe
            modelBuilder.Entity<Vente>()
                .HasOne(v => v.Societe)
                .WithMany(soc => soc.Ventes)
                .HasForeignKey(v => v.SocieteId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Vente-Article (optionnelle)
            modelBuilder.Entity<Vente>()
                .HasOne(v => v.ArticleEntity)
                .WithMany(a => a.Ventes)
                .HasForeignKey(v => v.ArticleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Vente-Lot (optionnelle)
            modelBuilder.Entity<Vente>()
                .HasOne(v => v.LotEntity)
                .WithMany()
                .HasForeignKey(v => v.LotId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des relations Ticket-Vente
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Vente)
                .WithMany(v => v.Tickets)
                .HasForeignKey(t => t.VenteId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
