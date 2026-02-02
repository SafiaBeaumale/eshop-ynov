using Basket.API.Models;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public record AddItemCommand(string UserName, ShoppingCartItem Item) : ICommand<AddItemCommandResult>;
