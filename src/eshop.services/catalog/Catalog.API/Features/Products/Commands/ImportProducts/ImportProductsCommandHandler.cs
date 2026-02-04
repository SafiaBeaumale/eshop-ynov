using BuildingBlocks.CQRS;
using Catalog.API.Models;
using ClosedXML.Excel;
using Marten;
using System.Globalization;

namespace Catalog.API.Features.Products.Commands.ImportProducts;

/// <summary>
/// Handles the import of products from an Excel file.
/// </summary>
public class ImportProductsCommandHandler
    : ICommandHandler<ImportProductsCommand, ImportProductsCommandResult>
{
    private readonly IDocumentSession _documentSession;

    /// <summary>
    /// Initializes a new instance of the <see cref="ImportProductsCommandHandler"/> class.
    /// </summary>
    /// <param name="documentSession">Marten document session.</param>
    public ImportProductsCommandHandler(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    /// <summary>
    /// Handles the import of products from an uploaded Excel file.
    /// </summary>
    public async Task<ImportProductsCommandResult> Handle(
        ImportProductsCommand request,
        CancellationToken cancellationToken)
    {
        if (request.File is null || request.File.Length == 0)
            throw new ArgumentException("No file uploaded");

        var importedCount = 0;

        await using var stream = request.File.OpenReadStream();
        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheet(1);

        // Start at row 2 (row 1 = header)
        foreach (var row in worksheet.RowsUsed().Skip(1))
        {
            var idText = row.Cell(1).GetString();
            var name = row.Cell(2).GetString();
            var description = row.Cell(3).GetString();
            var priceText = row.Cell(4).GetString();
            var imageFile = row.Cell(5).GetString();
            var categoriesText = row.Cell(6).GetString();

            if (string.IsNullOrWhiteSpace(name))
                continue; // skip invalid rows

            var id = Guid.TryParse(idText, out var parsedId)
                ? parsedId
                : Guid.NewGuid();

            var price = decimal.TryParse(
                priceText,
                NumberStyles.Any,
                CultureInfo.InvariantCulture,
                out var parsedPrice)
                ? parsedPrice
                : 0m;

            var categories = categoriesText
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();

            var product = new Product
            {
                Id = id,
                Name = name,
                Description = description,
                Price = price,
                ImageFile = imageFile,
                Categories = categories
            };

            _documentSession.Store(product);
            importedCount++;
        }

        await _documentSession.SaveChangesAsync(cancellationToken);

        return new ImportProductsCommandResult(importedCount);
    }
}
