namespace Catalog.API.Features.Products.Queries.GetProductStock;

/// <summary>
/// Result containing the product id and its current stock quantity.
/// </summary>
public record GetProductStockQueryResult(Guid ProductId, int Stock);
