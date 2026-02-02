using BuildingBlocks.CQRS;
using Catalog.API.Models;
using ClosedXML.Excel;
using Marten;

namespace Catalog.API.Features.Products.Queries.ExportProducts;

/// <summary>
/// Handles exporting products to an Excel file.
/// </summary>
public class ExportProductsQueryHandler
    : IQueryHandler<ExportProductsQuery, ExportProductsQueryResult>
{
    private readonly IDocumentSession _documentSession;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="documentSession"></param>
    public ExportProductsQueryHandler(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="request"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<ExportProductsQueryResult> Handle(
        ExportProductsQuery request,
        CancellationToken cancellationToken)
    {
        var products = await _documentSession
            .Query<Product>()
            .ToListAsync(cancellationToken);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Products");

        // Header
        worksheet.Cell(1, 1).Value = "Id";
        worksheet.Cell(1, 2).Value = "Name";
        worksheet.Cell(1, 3).Value = "Description";
        worksheet.Cell(1, 4).Value = "Price";
        worksheet.Cell(1, 5).Value = "ImageFile";
        worksheet.Cell(1, 6).Value = "Categories";

        var row = 2;

        foreach (var product in products)
        {
            worksheet.Cell(row, 1).Value = product.Id.ToString();
            worksheet.Cell(row, 2).Value = product.Name;
            worksheet.Cell(row, 3).Value = product.Description;
            worksheet.Cell(row, 4).Value = product.Price;
            worksheet.Cell(row, 5).Value = product.ImageFile;
            worksheet.Cell(row, 6).Value = string.Join(",", product.Categories);

            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return new ExportProductsQueryResult(
            stream.ToArray(),
            $"products-{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx"
        );
    }
}