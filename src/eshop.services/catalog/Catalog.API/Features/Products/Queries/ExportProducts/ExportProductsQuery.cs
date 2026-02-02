using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Queries.ExportProducts;

/// <summary>
/// Query to export products to an Excel file.
/// </summary>
public record ExportProductsQuery : IQuery<ExportProductsQueryResult>;