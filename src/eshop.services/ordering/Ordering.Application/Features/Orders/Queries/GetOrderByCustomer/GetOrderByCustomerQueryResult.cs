using Catalog.API.Models;

namespace Ordering.Application.Features.Orders.Queries.GetOrderByCustomer;

/// <summary>
/// Represents the result of a query to retrieve an order by its customer.
/// Contains the retrieved <see cref="Order"/> details.
/// </summary>
/// <param name="Orders"></param>
public record GetOrderByCustomerQueryResult(
    IReadOnlyList<Order> Orders
);
