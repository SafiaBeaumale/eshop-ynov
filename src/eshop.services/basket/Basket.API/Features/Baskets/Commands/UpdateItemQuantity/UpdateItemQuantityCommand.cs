using System.Text.Json.Serialization;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public record UpdateItemQuantityCommand(
    [property: JsonPropertyName("userName")] string UserName,
    [property: JsonPropertyName("productId")] Guid ProductId,
    [property: JsonPropertyName("quantity")] int Quantity)
    : ICommand<UpdateItemQuantityCommandResult>;
