using BuildingBlocks.CQRS;
using Microsoft.EntityFrameworkCore;
using Ordering.Application.Features.Orders.Data;
using Ordering.Application.Features.Orders.Dtos;
using Ordering.Domain.ValueObjects;

namespace Ordering.Application.Features.Orders.Queries.GetOrdersByCustomerId;

/// <summary>
/// Handles the query to retrieve all orders for a specific customer.
/// </summary>
public class GetOrdersByCustomerIdQueryHandler(IOrderingDbContext orderingDbContext)
    : IQueryHandler<GetOrdersByCustomerIdQuery, IEnumerable<OrderDto>>
{
    public async Task<IEnumerable<OrderDto>> Handle(GetOrdersByCustomerIdQuery request, CancellationToken cancellationToken)
    {
        var customerId = CustomerId.Of(request.CustomerId);

        var orders = await orderingDbContext.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.CustomerId == customerId)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return orders.Select(OrderMapper.ToDto);
    }
}
