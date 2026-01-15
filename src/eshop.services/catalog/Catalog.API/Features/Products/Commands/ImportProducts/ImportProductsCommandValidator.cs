using FluentValidation;

namespace Catalog.API.Features.Products.Commands.ImportProducts;

public class ImportProductsCommandValidator : AbstractValidator<ImportProductsCommand>
{
    public ImportProductsCommandValidator()
    {
        RuleFor(cmd => cmd.File)
            .NotNull().WithMessage("Excel file is required")
            .Must(f => f.Length > 0).WithMessage("Uploaded file is empty")
            .Must(f => f.FileName.EndsWith(".xlsx")).WithMessage("File must be an Excel (.xlsx) file");
    }
}