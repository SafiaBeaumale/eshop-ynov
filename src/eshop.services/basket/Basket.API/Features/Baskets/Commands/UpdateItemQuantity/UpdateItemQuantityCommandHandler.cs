using Basket.API.Data.Repositories;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public class UpdateItemQuantityCommandHandler(IBasketRepository repository)
    : ICommandHandler<UpdateItemQuantityCommand, UpdateItemQuantityCommandResult>
{
    public async Task<UpdateItemQuantityCommandResult> Handle(UpdateItemQuantityCommand request,
        CancellationToken cancellationToken)
    {
        var cart = await repository
            .UpdateItemQuantityAsync(request.UserName, request.ProductId, request.Quantity, cancellationToken)
            .ConfigureAwait(false);

        return new UpdateItemQuantityCommandResult(true, cart);
    }
}
