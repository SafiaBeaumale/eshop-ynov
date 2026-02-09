using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Ordering.Application.Features.Orders.Data;
using Ordering.Application.Features.Orders.Dtos;
using Ordering.Application.Features.Orders.Mappers;

namespace Ordering.Application.Features.Orders.Queries.GetOrders;

/// <summary>
/// Handles the query to retrieve all orders with pagination.
/// </summary>
/// <param name="orderingDbContext">The ordering database context.</param>
public class GetOrdersQueryHandler(IOrderingDbContext orderingDbContext)
    : IQueryHandler<GetOrdersQuery, GetOrdersResponse>
{
    /// <summary>
    /// Handles the GetOrdersQuery and retrieves all orders with pagination.
    /// </summary>
    /// <param name="request">The query request containing pagination parameters.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A response containing the paginated list of orders.</returns>
    public async Task<GetOrdersResponse> Handle(GetOrdersQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await orderingDbContext.Orders
            .Include(o => o.OrderItems)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new GetOrdersResponse(orders.Select(OrderMapper.ToDto));
    }
}
