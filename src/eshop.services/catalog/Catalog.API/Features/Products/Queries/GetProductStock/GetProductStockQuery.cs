using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Queries.GetProductStock;

/// <summary>
/// Query to retrieve only the stock quantity for a product by its id.
/// </summary>
public record GetProductStockQuery(Guid ProductId) : IQuery<GetProductStockQueryResult>;
