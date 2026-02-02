using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public record UpdateItemQuantityCommand(string UserName, Guid ProductId, int Quantity)
    : ICommand<UpdateItemQuantityCommandResult>;
