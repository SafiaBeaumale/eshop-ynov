using BuildingBlocks.CQRS;

namespace Ordering.Application.Features.Orders.Queries.GetOrderAll;

/// <summary>
/// 
/// </summary>
/// <param name="PageNumber"></param>
/// <param name="PageSize"></param>
public record GetOrderAllQuery(int PageNumber, int PageSize) : IQuery<GetOrderAllResponse>;
