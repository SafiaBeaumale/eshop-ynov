using Basket.API.Data.Repositories;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public class AddItemCommandHandler(IBasketRepository repository)
    : ICommandHandler<AddItemCommand, AddItemCommandResult>
{
    public async Task<AddItemCommandResult> Handle(AddItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await repository.AddItemAsync(request.UserName, request.Item, cancellationToken)
            .ConfigureAwait(false);

        return new AddItemCommandResult(true, cart);
    }
}
