using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Queries.GetProductByCategory;

/// <summary>
/// Represents a query to retrieve a product by its category.
/// This query returns a result of type <see cref="GetProductByCategory"/>.
/// </summary>
public record GetProductByCategoryQuery(String Category) : IQuery<GetProductByCategoryQueryResult>;