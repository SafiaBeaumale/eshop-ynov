using Ordering.Application.Features.Orders.Dtos;

namespace Ordering.Application.Features.Orders.Queries.GetOrdersById;

/// <summary>
/// Represents the response containing an order retrieved by its identifier.
/// </summary>
/// <param name="Order">The order data.</param>
public record GetOrdersByIdResponse(OrderDto Order);
