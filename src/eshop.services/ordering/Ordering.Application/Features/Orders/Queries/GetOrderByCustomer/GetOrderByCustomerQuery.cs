using BuildingBlocks.CQRS;

namespace Ordering.Application.Features.Orders.Queries.GetOrderByUser;

/// <summary>
/// Represents a query to retrieve an order by its customer.
/// This query returns a result of type <see cref="GetOrderByCustomerQueryResult"/>.
/// </summary>
public record GetOrderByCustomerQuery(String CustomerId) : IQuery<GetOrderByCustomerQueryResult>;