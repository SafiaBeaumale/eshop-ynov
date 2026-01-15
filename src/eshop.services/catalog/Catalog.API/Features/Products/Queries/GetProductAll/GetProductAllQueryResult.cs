using Catalog.API.Models;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

public record GetProductAllQueryResult(IEnumerable<Product> Products);
