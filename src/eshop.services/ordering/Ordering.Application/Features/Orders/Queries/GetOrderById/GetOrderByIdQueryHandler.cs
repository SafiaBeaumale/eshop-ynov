using BuildingBlocks.CQRS;
using Ordering.Application.Exceptions;
using Ordering.Domain.Models;
using Marten;

namespace Ordering.Application.Features.Orders.Queries.GetOrderById;

/// <summary>
/// Handles the execution of the <see cref="GetOrderByIdQuery"/> and retrieves the corresponding
/// order data from the data store.
/// </summary>
/// <remarks>
/// This class interacts with the database session to load the order identified by
/// the specified <see cref="Guid"/> in the query. If the order does not exist,
/// a <see cref="OrderNotFoundException"/> is thrown. It utilizes a logger to log
/// the status and outcome of the operation.
/// </remarks>
public class GetOrderByIdQueryHandler(IDocumentSession documentSession) 
    : IQueryHandler<GetOrderByIdQuery, GetOrderByIdQueryResult>
{
    /// <summary>
    /// Handles the execution of the GetOrderByIdQuery and retrieves the associated order data.
    /// </summary>
    /// <param name="request">The query containing the identifier for the order to be retrieved.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation, containing the result of the query, including the order data.</returns>
    /// <exception cref="OrderNotFoundException">Thrown when the order with the given identifier is not found in the database.</exception>
    public async Task<GetOrderByIdQueryResult> Handle(GetOrderByIdQuery request,
        CancellationToken cancellationToken)
    {
        var order = await documentSession.LoadAsync<Order>(request.Id, cancellationToken);
        return order is null ? throw new OrderNotFoundException(request.Id) : new GetOrderByIdQueryResult(order);
    }
}