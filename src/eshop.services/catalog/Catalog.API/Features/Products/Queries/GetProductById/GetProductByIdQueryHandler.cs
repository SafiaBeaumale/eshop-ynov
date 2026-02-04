using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Queries.GetProductById;

/// <summary>
/// Handles the execution of the <see cref="GetProductByIdQuery"/> and retrieves the corresponding
/// product data from the data store.
/// </summary>
/// <remarks>
/// This class interacts with the database session to load the product identified by
/// the specified <see cref="Guid"/> in the query. If the product does not exist,
/// a <see cref="ProductNotFoundException"/> is thrown. It utilizes a logger to log
/// the status and outcome of the operation.
/// </remarks>
public class GetProductByIdQueryHandler(IDocumentSession documentSession) 
    : IQueryHandler<GetProductByIdQuery, GetProductByIdQueryResult>
{
    /// <summary>
    /// Handles the execution of the GetProductByIdQuery and retrieves the associated product data.
    /// </summary>
    /// <param name="request">The query containing the identifier for the product to be retrieved.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation, containing the result of the query, including the product data.</returns>
    /// <exception cref="ProductNotFoundException">Thrown when the product with the given identifier is not found in the database.</exception>
    public async Task<GetProductByIdQueryResult> Handle(GetProductByIdQuery request,
        CancellationToken cancellationToken)
    {
        var product = await documentSession.LoadAsync<Product>(request.Id, cancellationToken);
        return product is null ? throw new ProductNotFoundException(request.Id) : new GetProductByIdQueryResult(product);
    }
}