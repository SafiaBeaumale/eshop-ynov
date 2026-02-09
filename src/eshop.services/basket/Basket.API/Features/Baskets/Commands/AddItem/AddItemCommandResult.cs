using Basket.API.Models;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public record AddItemCommandResult(bool IsSuccess, ShoppingCart Cart);
