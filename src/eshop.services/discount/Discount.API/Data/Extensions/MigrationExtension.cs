using Microsoft.EntityFrameworkCore;

namespace Discount.API.Data.Extensions;

public static class MigrationExtension
{
    public static IApplicationBuilder UseCustomMigration(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        using var dbContext = scope.ServiceProvider.GetRequiredService<DiscountContext>();
        dbContext.Database.MigrateAsync();

        return app;
    }
}
