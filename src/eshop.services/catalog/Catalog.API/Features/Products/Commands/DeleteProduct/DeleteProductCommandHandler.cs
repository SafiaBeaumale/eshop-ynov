using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Commands.DeleteProduct;

/// <summary>
/// Handles the DeleteProduct command to delete a product in the system by persisting it through the provided document session.
/// </summary>
public class DeleteProductCommandHandler(IDocumentSession documentSession): ICommandHandler<DeleteProductCommand, DeleteProductCommandResult>
{
    /// <summary>
    /// Handles the processing of the DeleteProduct command, which Delete a product to the system.
    /// It ensures the product already exist and delete it to the database.
    /// </summary>
    /// <param name="request">The DeleteProduct command containing the details of the product to delete.</param>
    /// <param name="cancellationToken">A token that can be used to cancel the operation.</param>
    /// <returns>A task representing the operation, containing the result of the command which includes the product ID.</returns>
    /// <exception cref="ProductNotFoundException">Thrown when the product not already exists in the system.</exception>
    public async Task<DeleteProductCommandResult> Handle(
        DeleteProductCommand request,
        CancellationToken cancellationToken)
    {
        var existingProduct = await documentSession.LoadAsync<Product>(request.Id, cancellationToken);

        if (existingProduct is null)
            throw new ProductNotFoundException(request.Id);

        documentSession.Delete(existingProduct);
        await documentSession.SaveChangesAsync(cancellationToken);

        return new DeleteProductCommandResult(true);
    }

}