using BuildingBlocks.CQRS;

namespace Catalog.API.Features.Products.Queries.GetProductAll;

public record GetProductAllQuery(int PageNumber, int PageSize) : IQuery<GetProductAllQueryResult>;
