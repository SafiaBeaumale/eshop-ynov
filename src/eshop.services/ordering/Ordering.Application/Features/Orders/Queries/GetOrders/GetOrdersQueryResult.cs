using Ordering.Application.Features.Orders.Dtos;

namespace Ordering.Application.Features.Orders.Queries.GetOrders;

/// <summary>
/// Represents the response containing all orders.
/// </summary>
/// <param name="Orders">The collection of orders.</param>
public record GetOrdersResponse(IEnumerable<OrderDto> Orders);
