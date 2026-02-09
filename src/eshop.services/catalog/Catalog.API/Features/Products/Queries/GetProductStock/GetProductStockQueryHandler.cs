using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductStock;

/// <summary>
/// Handles the GetProductStock query and returns the current stock quantity for the product.
/// </summary>
public class GetProductStockQueryHandler(IDocumentSession documentSession)
    : IQueryHandler<GetProductStockQuery, GetProductStockQueryResult>
{
    public async Task<GetProductStockQueryResult> Handle(
        GetProductStockQuery request,
        CancellationToken cancellationToken)
    {
        var product = await documentSession.LoadAsync<Product>(request.ProductId, cancellationToken);

        if (product is null)
            throw new ProductNotFoundException(request.ProductId);

        return new GetProductStockQueryResult(product.Id, product.Stock);
    }
}
