using Catalog.API.Models;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

/// <summary>
/// 
/// </summary>
/// <param name="Products"></param>
public record GetProductAllQueryResult(IEnumerable<Product> Products);
