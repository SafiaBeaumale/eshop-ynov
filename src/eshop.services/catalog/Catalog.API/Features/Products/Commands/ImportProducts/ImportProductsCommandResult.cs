namespace Catalog.API.Features.Products.Commands.ImportProducts;

/// <summary>
/// Represents the result of importing products.
/// </summary>
/// <param name="ImportedCount">Number of products successfully imported.</param>
public record ImportProductsCommandResult(int ImportedCount);