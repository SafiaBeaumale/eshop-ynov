using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

/// <summary>
/// 
/// </summary>
/// <param name="PageNumber"></param>
/// <param name="PageSize"></param>
public record GetProductAllQuery(int PageNumber, int PageSize) : IQuery<GetProductAllQueryResult>;
