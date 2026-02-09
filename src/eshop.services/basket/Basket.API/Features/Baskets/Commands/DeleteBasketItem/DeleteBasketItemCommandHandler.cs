using Basket.API.Data.Repositories;
using Basket.API.Services;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.DeleteBasketItem;

public class DeleteBasketItemCommandHandler(
    IBasketRepository repository,
    IDiscountCalculatorService discountCalculator)
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

        // Recalculer le total avec les reductions apres suppression de l'item
        if (basket.Items.Any())
        {
            basket.TotalAfterDiscount = await discountCalculator.CalculateTotalAfterDiscountAsync(basket, cancellationToken);
        }
        else
        {
            basket.TotalAfterDiscount = 0;
        }

        await repository.UpdateBasketAsync(basket, cancellationToken)
            .ConfigureAwait(false);

        return new DeleteBasketItemCommandResult(true);
    }
}
