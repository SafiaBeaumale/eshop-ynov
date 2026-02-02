using BuildingBlocks.CQRS;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

/// <summary>
/// 
/// </summary>
/// <param name="documentSession"></param>
public class GetProductAllQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetProductAllQuery, GetProductAllQueryResult>
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