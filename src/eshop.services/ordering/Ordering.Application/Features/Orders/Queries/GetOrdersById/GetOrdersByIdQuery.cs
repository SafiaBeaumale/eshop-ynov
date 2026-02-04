using BuildingBlocks.CQRS;

namespace Ordering.Application.Features.Orders.Queries.GetOrdersById;

/// <summary>
/// Represents a query to retrieve an order by its unique identifier.
/// </summary>
/// <param name="Id">The unique identifier of the order.</param>
public record GetOrdersByIdQuery(Guid Id) : IQuery<GetOrdersByIdResponse>;
