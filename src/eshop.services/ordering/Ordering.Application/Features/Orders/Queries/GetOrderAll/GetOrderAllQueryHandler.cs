using BuildingBlocks.CQRS;
using Ordering.Application.Models;
using Marten;

namespace Ordering.Application.Features.Orders.Queries.GetOrderAll;

/// <summary>
/// 
/// </summary>
/// <param name="documentSession"></param>
public class GetOrderAllQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetOrderAllQuery, GetOrderAllResponse>
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<GetProductAllQueryResult> Handle(GetProductAllQuery request,
        CancellationToken cancellationToken)
    {
        var products = await documentSession.Query<Product>()
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
        
        return new GetProductAllQueryResult(products);
    }
}