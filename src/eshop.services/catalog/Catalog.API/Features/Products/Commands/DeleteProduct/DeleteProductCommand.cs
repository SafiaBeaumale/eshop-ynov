using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Commands.DeleteProduct;

/// <summary>
/// Represents a command to delete an existing product in the catalog.
/// </summary>
/// <param name="Id">The unique identifier of the product to be deleted.</param>
public record DeleteProductCommand(Guid Id) : ICommand<DeleteProductCommandResult>;