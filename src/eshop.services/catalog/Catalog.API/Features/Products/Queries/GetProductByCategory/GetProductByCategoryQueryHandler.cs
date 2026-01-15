using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductByCategory;

public class GetProductByCategoryQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetProductByCategoryQuery, GetProductByCategoryQueryResult>
{
    public async Task<GetProductByCategoryQueryResult> Handle(
        GetProductByCategoryQuery request,
        CancellationToken cancellationToken)
    {
        var products = await documentSession.Query<Product>()
            .Where(p => p.Categories.Contains(request.category))
            .ToListAsync(cancellationToken);

        if (!products.Any())
        {
            throw new ProductsByCategoryNotFoundException(request.category);
        }

        return new GetProductByCategoryQueryResult(products);
    }
}