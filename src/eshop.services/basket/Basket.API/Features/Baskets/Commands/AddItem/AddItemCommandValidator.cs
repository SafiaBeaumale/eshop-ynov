using FluentValidation;

namespace Basket.API.Features.Baskets.Commands.AddItem;

public class AddItemCommandValidator : AbstractValidator<AddItemCommand>
{
    public AddItemCommandValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
        RuleFor(x => x.Item).NotNull().WithMessage("Item is required");
        RuleFor(x => x.Item.ProductId).NotEmpty().WithMessage("ProductId is required");
        RuleFor(x => x.Item.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0");
        RuleFor(x => x.Item.ProductName).NotEmpty().WithMessage("ProductName is required");
    }
}
