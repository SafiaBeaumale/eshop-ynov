using Catalog.API.Models;

namespace Catalog.API.Features.Products.Queries.GetProductByCategory;

/// <summary>
/// Represents the result of a query to retrieve a product by its category.
/// Contains the retrieved <see cref="Product"/> details.
/// </summary>
/// <param name="Product"></param>
public record GetProductByCategoryQueryResult(
    IReadOnlyList<Product> Products
);
