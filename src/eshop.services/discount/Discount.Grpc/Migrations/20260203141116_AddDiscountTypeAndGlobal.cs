using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Discount.Grpc.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscountTypeAndGlobal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGlobal",
                table: "Coupon",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Coupon",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Amount", "Description", "IsGlobal", "Type" },
                values: new object[] { 10.0, "Promo IPhone", false, 0 });

            migrationBuilder.UpdateData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Amount", "Description", "IsGlobal", "Type" },
                values: new object[] { 50.0, "Promo Samsung", false, 1 });

            migrationBuilder.InsertData(
                table: "Coupon",
                columns: new[] { "Id", "Amount", "Description", "IsGlobal", "ProductName", "Type" },
                values: new object[,]
                {
                    { 3, 5.0, "Code promo global -5%", true, "", 0 },
                    { 4, 10.0, "Bon de reduction 10 euros", true, "", 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "IsGlobal",
                table: "Coupon");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Coupon");

            migrationBuilder.UpdateData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Amount", "Description" },
                values: new object[] { 150.0, "IPhone X New" });

            migrationBuilder.UpdateData(
                table: "Coupon",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Amount", "Description" },
                values: new object[] { 100.0, "Samsung 10 New" });
        }
    }
}
