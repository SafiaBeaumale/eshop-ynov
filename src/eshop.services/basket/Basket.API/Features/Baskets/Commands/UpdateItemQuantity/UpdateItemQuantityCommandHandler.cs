using Basket.API.Data.Repositories;
using Basket.API.Models;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using Discount.Grpc;
using Grpc.Core;

namespace Basket.API.Features.Baskets.Commands.UpdateItemQuantity;

public class UpdateItemQuantityCommandHandler(
    IBasketRepository repository,
    DiscountProtoService.DiscountProtoServiceClient discountProtoServiceClient)
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

        await SetTotalAfterDiscountAsync(cart, cancellationToken);

        cart = await repository.UpdateBasketAsync(cart, cancellationToken).ConfigureAwait(false);

        return new UpdateItemQuantityCommandResult(true, cart);
    }

    private async Task SetTotalAfterDiscountAsync(ShoppingCart cart, CancellationToken cancellationToken)
    {
        decimal totalAfterDiscount = 0;
        foreach (var basketItem in cart.Items)
        {
            try
            {
                var coupon = await discountProtoServiceClient.GetDiscountAsync(
                    new GetDiscountRequest { ProductName = basketItem.ProductName },
                    cancellationToken: cancellationToken).ConfigureAwait(false);
                var unitPriceAfterDiscount = Math.Max(0, basketItem.Price - (decimal)coupon.Amount);
                totalAfterDiscount += unitPriceAfterDiscount * basketItem.Quantity;
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
            {
                totalAfterDiscount += basketItem.Price * basketItem.Quantity;
            }
        }
        cart.TotalAfterDiscount = totalAfterDiscount;
    }
}
