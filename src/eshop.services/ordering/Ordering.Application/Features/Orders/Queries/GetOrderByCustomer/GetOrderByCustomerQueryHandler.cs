using BuildingBlocks.CQRS;
using Ordering.Application.Exceptions;
using Ordering.Application.Models;
using Marten;

namespace Ordering.Application.Features.Orders.Queries.GetOrderByCustomer;

/// <summary>
/// 
/// </summary>
/// <param name="documentSession"></param>
public class GetOrderByCustomerQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetOrderByCustomerQuery, GetOrderByCustomerQueryResult>
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="OrdersByCustomerNotFoundException"></exception>
    public async Task<GetOrderByCustomerQueryResult> Handle(
        GetOrderByCustomerQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await documentSession.Query<Order>()
            .Where(p => p.CustomerId == request.CustomerId)
            .ToListAsync(cancellationToken);

        if (!orders.Any())
        {
            throw new OrdersByCustomerNotFoundException(request.CustomerId);
        }

        return new GetOrderByCustomerQueryResult(orders);
    }
}