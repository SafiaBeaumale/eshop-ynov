using Discount.Grpc.Models;
using Microsoft.EntityFrameworkCore;

namespace Discount.Grpc.Data;

public sealed class DiscountContext(DbContextOptions<DiscountContext> options) : DbContext(options)
{
    public DbSet<Coupon> Coupons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Coupon>().ToTable("Coupon")
            .HasData([
                new Coupon { Id = 1, ProductName = "IPhone X", Description = "Promo IPhone", Amount = 10.0, Type = Models.DiscountType.Percentage, IsGlobal = false },
                new Coupon { Id = 2, ProductName = "Samsung 10", Description = "Promo Samsung", Amount = 50.0, Type = Models.DiscountType.FixedAmount, IsGlobal = false },
                new Coupon { Id = 3, ProductName = "", Description = "Code promo global -5%", Amount = 5.0, Type = Models.DiscountType.Percentage, IsGlobal = true },
                new Coupon { Id = 4, ProductName = "", Description = "Bon de reduction 10 euros", Amount = 10.0, Type = Models.DiscountType.FixedAmount, IsGlobal = true }
            ]);
    }
}