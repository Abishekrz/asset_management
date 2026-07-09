
function editIssue(id) {

    $.get("/Issue/" + id, function (issue) {
        $("#modalTitle").text("Edit Issue");
        $("#issue_id").val(issue.issue_id);
        $("#asset_id").val(issue.asset_id);
        $("#employee_id").val(issue.employee_id);
        $("#issue_date").val(issue.issue_date);
        $("#return_date").val(issue.return_date);
        $("#reason").val(issue.reason);
        $("#IssueForm")
            .attr("action","/Issue/edit"+issue.issue_id);
        const modal = new bootstrap.Modal(
            document.getElementById("issueModal")
        ) ;
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