using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Commands.DecrementStock;

/// <summary>
/// Handles the DecrementStock command by reducing the stock of each product by the requested quantity.
/// </summary>
public class DecrementStockCommandHandler(IDocumentSession documentSession)
    : ICommandHandler<DecrementStockCommand, DecrementStockCommandResult>
{
    public async Task<DecrementStockCommandResult> Handle(
        DecrementStockCommand request,
        CancellationToken cancellationToken)
    {
        foreach (var item in request.Items)
        {
            var product = await documentSession.LoadAsync<Product>(item.ProductId, cancellationToken);

            if (product is null)
                throw new ProductNotFoundException(item.ProductId);

            if (product.Stock < item.Quantity)
                throw new InsufficientStockException(item.ProductId, item.Quantity, product.Stock);

            product.Stock -= item.Quantity;
            documentSession.Update(product);
        }

        await documentSession.SaveChangesAsync(cancellationToken);
        return new DecrementStockCommandResult(true);
    }
}
