namespace Catalog.API.Features.Products.Commands.DecrementStock;

/// <summary>
/// Result of the decrement stock operation.
/// </summary>
/// <param name="IsSuccessful">True if all items were decremented successfully.</param>
public record DecrementStockCommandResult(bool IsSuccessful);
