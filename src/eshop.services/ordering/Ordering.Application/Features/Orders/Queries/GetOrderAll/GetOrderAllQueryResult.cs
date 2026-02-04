using Ordering.Application.Models;

namespace Ordering.Application.Features.Orders.Queries.GetOrderAll;

/// <summary>
/// 
/// </summary>
/// <param name="Orders"></param>
public record GetOrderAllResponse(IEnumerable<Order> Orders);