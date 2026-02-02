using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.ValidateBasket;

/// <summary>
/// Represents a command to validate a user's basket based on the provided username.
/// </summary>
/// <remarks>
/// This command is used within the CQRS pattern and implements the ICommand interface with a response type of ValidateBasketCommandResult.
/// </remarks>
/// <param name="UserName">The username associated with the basket to be validated.</param>
public record ValidateBasketCommand(string UserName) : ICommand<ValidateBasketCommandResult>;