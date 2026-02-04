using BuildingBlocks.CQRS;
using Ordering.Application.Models;

namespace Ordering.Application.Features.Orders.Queries.GetOrderById;

/// <summary>
/// Represents a query to retrieve an order by its unique identifier.
/// This query returns a result of type <see cref="GetOrderByIdQueryResult"/>.
/// </summary>
public record GetOrderByIdQuery(Guid Id) : IQuery<GetOrderByIdQueryResult>;