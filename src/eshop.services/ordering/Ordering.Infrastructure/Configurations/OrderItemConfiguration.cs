using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ordering.Domain.Models;
using Ordering.Domain.ValueObjects.Types;

namespace Ordering.Infrastructure.Configurations;

public class OrderItemConfiguration :IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasConversion(
            id => id.Value,
            dbId => OrderItemId.Of(dbId)
        );
        builder.Property(c => c.OrderId).HasConversion(
            id => id.Value,
            dbId => OrderId.Of(dbId)
        );
        builder.Property(c => c.ProductId).HasConversion(
            id => id.Value,
            dbId => ProductId.Of(dbId)
        );
        // No FK to Products table — products come from the Catalog microservice
        builder.Property(c => c.ProductId).IsRequired();
        builder.Property(c => c.ProductName).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Quantity).IsRequired();
        builder.Property(c => c.Price).HasPrecision(18, 2).IsRequired();
    }
}