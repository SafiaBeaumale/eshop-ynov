using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductByCategory;

/// <summary>
/// 
/// </summary>
/// <param name="documentSession"></param>
public class GetProductByCategoryQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetProductByCategoryQuery, GetProductByCategoryQueryResult>
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="ProductsByCategoryNotFoundException"></exception>
    public async Task<GetProductByCategoryQueryResult> Handle(
        GetProductByCategoryQuery request,
        CancellationToken cancellationToken)
    {
        var products = await documentSession.Query<Product>()
            .Where(p => p.Categories.Contains(request.Category))
            .ToListAsync(cancellationToken);

        if (!products.Any())
        {
            throw new ProductsByCategoryNotFoundException(request.Category);
        }

        return new GetProductByCategoryQueryResult(products);
    }
}