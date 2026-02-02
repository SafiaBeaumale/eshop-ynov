using Basket.API.Models;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public record UpdateItemQuantityCommandResult(bool IsSuccess, ShoppingCart Cart);
