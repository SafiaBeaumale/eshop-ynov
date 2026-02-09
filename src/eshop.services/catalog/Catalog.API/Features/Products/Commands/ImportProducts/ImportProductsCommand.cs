using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Commands.ImportProducts;

/// <summary>
/// Represents a command to import products from an Excel file.
/// </summary>
/// <param name="File">The Excel file containing product data.</param>
public record ImportProductsCommand(IFormFile File) : ICommand<ImportProductsCommandResult>;