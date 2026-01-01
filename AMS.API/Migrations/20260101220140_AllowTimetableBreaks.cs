using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AllowTimetableBreaks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimetableEntries_Courses_CourseId",
                table: "TimetableEntries");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "TimetableEntries",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_TimetableEntries_Courses_CourseId",
                table: "TimetableEntries",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimetableEntries_Courses_CourseId",
                table: "TimetableEntries");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "TimetableEntries",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TimetableEntries_Courses_CourseId",
                table: "TimetableEntries",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
