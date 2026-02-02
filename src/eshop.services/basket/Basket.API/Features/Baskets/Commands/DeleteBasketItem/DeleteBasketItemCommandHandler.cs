using Basket.API.Data.Repositories;
using BuildingBlocks.CQRS;
using Microsoft.Extensions.Logging;

namespace Basket.API.Features.Baskets.Commands.DeleteBasketItem;

public class DeleteBasketItemCommandHandler(IBasketRepository repository, ILogger<DeleteBasketItemCommandHandler> logger) 
    : ICommandHandler<DeleteBasketItemCommand, DeleteBasketItemCommandResult>
{
    public async Task<DeleteBasketItemCommandResult> Handle(DeleteBasketItemCommand request,
        CancellationToken cancellationToken)
    {
        var basket = await repository.GetBasketByUserNameAsync(request.UserName, cancellationToken)
            .ConfigureAwait(false);

        var itemsList = basket.Items.ToList();

        var itemToRemove = itemsList.FirstOrDefault(item => item.ProductId == request.ProductId);
        if (itemToRemove == null)
        {
            return new DeleteBasketItemCommandResult(false);
        }

        itemsList.Remove(itemToRemove);

        basket.Items = itemsList;

        await repository.CreateBasketAsync(basket, cancellationToken)
            .ConfigureAwait(false);

        return new DeleteBasketItemCommandResult(true);
    }
}

