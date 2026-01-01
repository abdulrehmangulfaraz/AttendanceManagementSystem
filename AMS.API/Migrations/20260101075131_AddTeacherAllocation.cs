using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacherAllocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeacherAllocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    SectionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherAllocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeacherAllocations_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherAllocations_Sections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "Sections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherAllocations_Users_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAllocations_CourseId",
                table: "TeacherAllocations",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAllocations_SectionId",
                table: "TeacherAllocations",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAllocations_TeacherId",
                table: "TeacherAllocations",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherAllocations");
        }
    }
}
