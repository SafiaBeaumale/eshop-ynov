using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using Microsoft.EntityFrameworkCore;
using Ordering.Application.Features.Orders.Data;
using Ordering.Application.Features.Orders.Mappers;
using Ordering.Domain.ValueObjects.Types;

namespace Ordering.Application.Features.Orders.Queries.GetOrdersById;

/// <summary>
/// Handles the execution of the <see cref="GetOrdersByIdQuery"/> and retrieves the corresponding
/// order data from the data store.
/// </summary>
/// <remarks>
/// This class interacts with the database context to load the order identified by
/// the specified <see cref="Guid"/> in the query. If the order does not exist,
/// a <see cref="NotFoundException"/> is thrown.
/// </remarks>
public class GetOrdersByIdQueryHandler(IOrderingDbContext orderingDbContext)
    : IQueryHandler<GetOrdersByIdQuery, GetOrdersByIdResponse>
{
    /// <summary>
    /// Handles the execution of the GetOrdersByIdQuery and retrieves the associated order data.
    /// </summary>
    /// <param name="request">The query containing the identifier for the order to be retrieved.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation, containing the order response.</returns>
    /// <exception cref="NotFoundException">Thrown when the order with the given identifier is not found in the database.</exception>
    public async Task<GetOrdersByIdResponse> Handle(GetOrdersByIdQuery request,
        CancellationToken cancellationToken)
    {
        var orderId = OrderId.Of(request.Id);

        var order = await orderingDbContext.Orders
            .Include(o => o.OrderItems)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);

        if (order is null)
        {
            throw new NotFoundException("Order", request.Id);
        }

        return new GetOrdersByIdResponse(OrderMapper.ToDto(order));
    }
}
