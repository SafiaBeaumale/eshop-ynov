using Basket.API.Data.Repositories;
using Basket.API.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public class UpdateItemQuantityCommandHandler(
    IBasketRepository repository,
    IDiscountCalculatorService discountCalculator)
    : ICommandHandler<UpdateItemQuantityCommand, UpdateItemQuantityCommandResult>
{
    public async Task<UpdateItemQuantityCommandResult> Handle(UpdateItemQuantityCommand request,
        CancellationToken cancellationToken)
    {
        var cart = await repository.GetBasketByUserNameAsync(request.UserName, cancellationToken)
            .ConfigureAwait(false);

        var item = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        if (item is null)
            throw new NotFoundException("produit", request.ProductId);

        item.Quantity = request.Quantity;

        // Recalculer le total avec les reductions (pourcentages d'abord, puis montants fixes, cumulables)
        cart.TotalAfterDiscount = await discountCalculator.CalculateTotalAfterDiscountAsync(cart, cancellationToken);

        cart = await repository.UpdateBasketAsync(cart, cancellationToken).ConfigureAwait(false);

        return new UpdateItemQuantityCommandResult(true, cart);
    }
}
