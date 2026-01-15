using BuildingBlocks.CQRS;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

public class GetProductAllQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetProductAllQuery, GetProductAllQueryResult>
{
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