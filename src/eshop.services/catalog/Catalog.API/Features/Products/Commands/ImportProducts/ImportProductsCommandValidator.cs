using FluentValidation;
using ClosedXML.Excel;
using System.Globalization;

namespace Catalog.API.Features.Products.Commands.ImportProducts;

/// <summary>
/// Validates the ImportProductsCommand and checks Excel content for correctness.
/// </summary>
public class ImportProductsCommandValidator : AbstractValidator<ImportProductsCommand>
{
    private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB

    /// <summary>
    /// 
    /// </summary>
    public ImportProductsCommandValidator()
    {
        RuleFor(cmd => cmd.File)
            .NotNull()
                .WithMessage("An Excel file is required.")
            .Must(f => f.Length > 0)
                .WithMessage("Uploaded file is empty.")
            .Must(f => f.FileName.EndsWith(".xlsx", System.StringComparison.OrdinalIgnoreCase))
                .WithMessage("File must have a .xlsx extension.")
            .Must(f => f.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .WithMessage("File must be an Excel (.xlsx) file.")
            .Must(f => f.Length <= MaxFileSize)
                .WithMessage($"File size cannot exceed {MaxFileSize / (1024 * 1024)} MB.")
            .Must(file =>
            {
                if (file == null || file.Length == 0)
                    return true; // Already handled

                try
                {
                    using var stream = file.OpenReadStream();
                    using var workbook = new XLWorkbook(stream);
                    var worksheet = workbook.Worksheet(1);

                    // Check header has exact number of columns
                    var header = worksheet.Row(1).Cells().Select(c => c.GetString().Trim()).ToList();
                    var expectedColumns = new[] { "Id", "Name", "Description", "Price", "ImageFile", "Categories" };
                    if (!expectedColumns.SequenceEqual(header))
                        return false;

                    // Check each data row
                    foreach (var row in worksheet.RowsUsed().Skip(1))
                    {
                        // Name is required
                        if (string.IsNullOrWhiteSpace(row.Cell(2).GetString()))
                            return false;

                        // Price must be a valid decimal
                        var priceText = row.Cell(4).GetString();
                        if (!decimal.TryParse(priceText, NumberStyles.Any, CultureInfo.InvariantCulture, out _))
                            return false;

                        // Categories is required
                        var categories = row.Cell(6).GetString();
                        if (string.IsNullOrWhiteSpace(categories))
                            return false;
                    }

                    return true;
                }
                catch
                {
                    return false; // Corrupted or unreadable Excel
                }
            })
            .WithMessage("Excel file is invalid: missing headers, wrong number of columns, or incorrect data types in rows.");
    }
}
