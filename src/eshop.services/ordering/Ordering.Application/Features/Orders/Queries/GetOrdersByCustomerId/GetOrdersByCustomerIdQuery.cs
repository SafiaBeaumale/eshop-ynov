using BuildingBlocks.CQRS;
using Ordering.Application.Features.Orders.Dtos;

namespace Ordering.Application.Features.Orders.Queries.GetOrdersByCustomerId;

/// <summary>
/// Query to retrieve all orders for a specific customer.
/// </summary>
/// <param name="CustomerId">The unique identifier of the customer.</param>
public record GetOrdersByCustomerIdQuery(Guid CustomerId) : IQuery<IEnumerable<OrderDto>>;
