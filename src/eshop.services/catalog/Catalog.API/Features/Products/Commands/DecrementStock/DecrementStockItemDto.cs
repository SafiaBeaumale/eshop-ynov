namespace Catalog.API.Features.Products.Commands.DecrementStock;

/// <summary>
/// Represents an item for which stock must be decremented (product id and quantity).
/// </summary>
public record DecrementStockItemDto(Guid ProductId, int Quantity);
