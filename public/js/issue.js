
function editIssue(id) {

    $.get("/Issue/" + id, function (issue) {
        $("#edit_issue_id").val(issue.issue_id);
        $("#edit_employee_id").val(issue.employee_id);
        $("#edit_asset_id").val(issue.asset_id);
        $("#edit_issue_date").val(issue.issue_date.substring(0,10));
        if (issue.return_date) {
            $("#edit_return_date").val(issue.return_date.substring(0,10));
        }
        $("#edit_reason").val(issue.reason);
        $("#editIssueForm")
            .attr("action", "/issue/edit/" + issue.issue_id);
        const modal = new bootstrap.Modal(
            document.getElementById("editIssueModal")
        );
        modal.show();
    });
}
$("#issueModal").on("show.bs.modal",function (e) {
    if($(e.relatedTarget).text().trim() ==="Add Issue"){
        $("#modalTitle").text("Add Issue");
        $("#issueForm").trigger("reset");
        $("#issue_id").val("");
        $("#issueForm").attr("action","/issue/add")
    }
});
// $(document).ready(function () {
//         const table = $(".datatable").DataTable();
//         function createFilter(selectId, columnIndex) {
//             table.column(columnIndex).data().unique().sort().each(function (value) {
//                 $(selectId).append(
//                     `<option value="${value}">${value}</option>`
//                 );
//             });
//             $(selectId).on("change", function () {
//                 table
//                     .column(columnIndex)
//                     .search($(this).val())
//                     .draw();
//             });
//         }
//         createFilter("#issueDateFilter",3);
//         createFilter("#returnDateFilter",4);
//         // createFilter("#employeeStatusFilter",5);
//         // createFilter("#");
//     });