using System.Text.Json.Serialization;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

/// <summary>
/// Request body for updating an item quantity. UserName comes from the URL.
/// </summary>
public record UpdateItemQuantityRequest(
    [property: JsonPropertyName("productId")] Guid ProductId,
    [property: JsonPropertyName("quantity")] int Quantity);
