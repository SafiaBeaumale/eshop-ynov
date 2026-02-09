using FluentValidation;

namespace Catalog.API.Features.Products.Commands.DecrementStock;

/// <summary>
/// Validates the DecrementStockCommand.
/// </summary>
public class DecrementStockCommandValidator : AbstractValidator<DecrementStockCommand>
{
    public DecrementStockCommandValidator()
    {
        RuleFor(c => c.Items)
            .NotEmpty()
            .WithMessage("Au moins un article est requis.");

        RuleForEach(c => c.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductId)
                .NotEmpty()
                .WithMessage("ProductId est requis.");

            item.RuleFor(x => x.Quantity)
                .GreaterThan(0)
                .WithMessage("La quantité doit être supérieure à 0.");
        });
    }
}
