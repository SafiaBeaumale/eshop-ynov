using Ordering.Application.Models;

namespace Ordering.Application.Features.Products.Queries.GetProductById;

/// <summary>
/// Represents the result of a query to retrieve a product by its unique identifier.
/// Contains the retrieved <see cref="Order"/> details.
/// </summary>
public record GetOrderByIdQueryResult(Order Order);