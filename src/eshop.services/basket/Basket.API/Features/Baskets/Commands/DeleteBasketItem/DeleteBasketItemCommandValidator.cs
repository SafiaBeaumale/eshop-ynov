using FluentValidation;

namespace Basket.API.Features.Baskets.Commands.DeleteBasketItem;

public class DeleteBasketItemCommandValidator : AbstractValidator<DeleteBasketItemCommand>
{
    public DeleteBasketItemCommandValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
        RuleFor(x => x.ProductId).NotEqual(Guid.Empty).WithMessage("ProductId is required and must be a valid GUID");
    }
}

 