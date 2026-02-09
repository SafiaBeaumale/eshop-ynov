namespace Catalog.API.Features.Products.Queries.ExportProducts;

/// <summary>
/// Result containing the exported Excel file.
/// </summary>
/// <param name="FileContent">Excel file bytes</param>
/// <param name="FileName">Excel file name</param>
public record ExportProductsQueryResult(byte[] FileContent, string FileName);