using BuildingBlocks.CQRS;
using Catalog.API.Exceptions;
using Catalog.API.Models;
using Marten;

namespace Catalog.API.Features.Products.Commands.UpdateProduct;

/// <summary>
/// Handles the UpdateProduct command to update a product in the system by persisting it through the provided document session.
/// </summary>
public class UpdateProductCommandHandler(IDocumentSession documentSession): ICommandHandler<UpdateProductCommand, UpdateProductCommandResult>
{
    /// <summary>
    /// Handles the processing of the UpdateProduct command, which update a product to the system.
    /// It ensures the product already exist and update it to the database.
    /// </summary>
    /// <param name="request">The UpdateProduct command containing the details of the product to update.</param>
    /// <param name="cancellationToken">A token that can be used to cancel the operation.</param>
    /// <returns>A task representing the operation, containing the result of the command which includes the product ID.</returns>
    /// <exception cref="ProductNotFoundException">Thrown when the product not already exists in the system.</exception>
    public async Task<UpdateProductCommandResult> Handle(
        UpdateProductCommand request,
        CancellationToken cancellationToken)
    {
        var existingProduct = await documentSession.LoadAsync<Product>(
            request.Id, cancellationToken);

        if (existingProduct is null)
            throw new ProductNotFoundException(request.Id);

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Price = request.Price;
        existingProduct.ImageFile = request.ImageFile;
        existingProduct.Categories = request.Categories;
        // Stock is not updated here; use DecrementStock or a dedicated endpoint for stock changes.

        documentSession.Update(existingProduct);

        await documentSession.SaveChangesAsync(cancellationToken);

        return new UpdateProductCommandResult(true);
    }

}