using Basket.API.Data.Repositories;
using Basket.API.Services;
using BuildingBlocks.CQRS;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public class AddItemCommandHandler(
    IBasketRepository repository,
    IDiscountCalculatorService discountCalculator) : ICommandHandler<AddItemCommand, AddItemCommandResult>
{
    public async Task<AddItemCommandResult> Handle(AddItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await repository.GetBasketByUserNameAsync(request.UserName, cancellationToken)
            .ConfigureAwait(false);

        var items = cart.Items.ToList();
        var existingItem = items.FirstOrDefault(i => i.ProductId == request.Item.ProductId);
        if (existingItem is not null)
            existingItem.Quantity += request.Item.Quantity;
        else
            items.Add(request.Item);
        cart.Items = items;

        // Calculer le total avec les reductions (pourcentages d'abord, puis montants fixes, cumulables)
        cart.TotalAfterDiscount = await discountCalculator.CalculateTotalAfterDiscountAsync(cart, cancellationToken);

        cart = await repository.UpdateBasketAsync(cart, cancellationToken).ConfigureAwait(false);

        return new AddItemCommandResult(true, cart);
    }
}
