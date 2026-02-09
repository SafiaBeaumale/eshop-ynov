using BuildingBlocks.CQRS;

namespace Ordering.Application.Features.Orders.Queries.GetOrders;

/// <summary>
/// Query to retrieve all orders with pagination.
/// </summary>
/// <param name="PageNumber">The page number to retrieve.</param>
/// <param name="PageSize">The number of orders per page.</param>
public record GetOrdersQuery(int PageNumber, int PageSize) : IQuery<GetOrdersResponse>;
