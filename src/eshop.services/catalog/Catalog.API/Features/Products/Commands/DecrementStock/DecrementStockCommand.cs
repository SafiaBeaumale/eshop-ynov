using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Commands.DecrementStock;

/// <summary>
/// Command to decrement stock for one or more products (e.g. when an order is placed).
/// </summary>
/// <param name="Items">List of product id and quantity to decrement.</param>
public record DecrementStockCommand(List<DecrementStockItemDto> Items) : ICommand<DecrementStockCommandResult>;
