using Basket.API.Data.Repositories;
using Basket.API.Models;
using BuildingBlocks.CQRS;
using Discount.Grpc;
using Grpc.Core;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public class AddItemCommandHandler(IBasketRepository repository, DiscountProtoService.DiscountProtoServiceClient discountProtoServiceClient) : ICommandHandler<AddItemCommand, AddItemCommandResult>
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

        await SetTotalAfterDiscountAsync(cart, cancellationToken);

        cart = await repository.UpdateBasketAsync(cart, cancellationToken).ConfigureAwait(false);

        return new AddItemCommandResult(true, cart);
    }

    private async Task SetTotalAfterDiscountAsync(ShoppingCart cart, CancellationToken cancellationToken)
    {
        decimal totalAfterDiscount = 0;
        foreach (var item in cart.Items)
        {
            try
            {
                var coupon = await discountProtoServiceClient.GetDiscountAsync(
                    new GetDiscountRequest { ProductName = item.ProductName },
                    cancellationToken: cancellationToken).ConfigureAwait(false);
                var unitPriceAfterDiscount = Math.Max(0, item.Price - (decimal)coupon.Amount);
                totalAfterDiscount += unitPriceAfterDiscount * item.Quantity;
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
            {
                totalAfterDiscount += item.Price * item.Quantity;
            }
        }
        cart.TotalAfterDiscount = totalAfterDiscount;
    }
}
