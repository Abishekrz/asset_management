function editEmployee(id) {

    $.get("/employee/" + id, function (employee) {
        $("#modalTitle").text("Edit Employee");
        $("#employee_id").val(employee.employee_id);
        $("#employee_name").val(employee.employee_name);
        $("#email").val(employee.email);
        $("#department").val(employee.department);
        $("#branch").val(employee.branch);  
        $("#status").val(employee.status);
        $("#joined_at").val(employee.joined_at); 
        $("#employeeForm")
            .attr("action","/employee/edit/"+employee.employee_id);
        const modal = new bootstrap.Modal(
            document.getElementById("employeeModal")
        ) ;
        modal.show();    
    });
}
$("#employeeModal").on("show.bs.modal",function (e) {
    if($(e.relatedTarget).text().trim() ==="Add Employee"){
        $("#modalTitle").text("Add Employee");
        $("#employeeForm").trigger("reset");
        $("#employee_id").val("");
        $("#employeeForm").attr("action","/employee/add")
    }
});