// Employee Functions

async function employeeExists(employeeName){
    const response=await fetch(
        `/employee/check-name?employee_name=${encodeURIComponent(employeeName)}`
    );

    const data=await response.json();

    if(!response.ok||!data.success){
        throw new Error(data.error||"Unable to check employee.");
    }

    return data.exists;
}

async function getEmployee(employeeId){
    const response=await fetch(`/employee/${employeeId}`);

    const data=await response.json();

    if(!response.ok){
        throw new Error(data.error||"Employee not found.");
    }

    return data;
}

async function findEmployeeByName(employeeName){
    try{
        const response=await fetch(
            `/employee/find-by-name?employee_name=${encodeURIComponent(employeeName)}`
        );

        if(response.status===404){
            return null;
        }

        if(!response.ok){
            throw new Error("Unable to search employee.");
        }

        const result=await response.json();

        return result.success ? result.data : null;

    }catch(err){
        console.error(err);
        return null;
    }
}

async function openEmployeeModal(args){
    try{

        if(await employeeExists(args.employee_name)){
            showAiStatus("Employee already exists.","warning");
            return;
        }

        const form=document.getElementById("employeeForm");
        const modal=document.getElementById("employeeModal");

        form.reset();

        form.action="/employee/add";

        document.getElementById("employee_id").value="";
        document.getElementById("employee_name").value=args.employee_name||"";
        document.getElementById("email").value=args.email||"";
        document.getElementById("department").value=args.department||"";
        document.getElementById("branch").value=args.branch||"";

        const status=document.getElementById("status");
        if(status){
            status.value=args.status||"ACTIVE";
        }

        const joinedAt=document.getElementById("joined_at");
        if(joinedAt){
            joinedAt.value=args.joined_at||"";
        }

        document.getElementById("employeeModalTitle").textContent="Add Employee";

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review employee details and click Save.","success");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openUpdateEmployeeModal(args){
    try{

        const currentEmployee=await findEmployeeByName(args.current_employee_name);

        if(!currentEmployee){
            showAiStatus(`Employee "${args.current_employee_name}" not found.`,"danger");
            return;
        }

        const employee=await getEmployee(currentEmployee.employee_id);

        const form=document.getElementById("employeeForm");
        const modal=document.getElementById("employeeModal");

        form.action=`/employee/edit/${employee.employee_id}`;

        document.getElementById("employeeModalTitle").textContent="Edit Employee";

        document.getElementById("employee_id").value=employee.employee_id;
        document.getElementById("employee_name").value=args.employee_name||employee.employee_name;
        document.getElementById("email").value=args.email||employee.email;
        document.getElementById("department").value=args.department||employee.department;
        document.getElementById("branch").value=args.branch||employee.branch;

        const status=document.getElementById("status");
        if(status){
            status.value=args.status||employee.status;
        }

        const joinedAt=document.getElementById("joined_at");
        if(joinedAt){
            joinedAt.value=args.joined_at||employee.joined_at;
        }

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review employee details and click Save.","success");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openDeleteEmployeeModal(args){
    try{

        const employee=await findEmployeeByName(args.employee_name);

        if(!employee){
            showAiStatus(`Employee "${args.employee_name}" not found.`,"danger");
            return;
        }

        const form=document.getElementById("deleteEmployeeForm");
        const modal=document.getElementById("deleteEmployeeModal");

        form.action=`/employee/delete/${employee.employee_id}`;

        document.getElementById("delete_employee_id").value=employee.employee_id;
        document.getElementById("delete_employee_name").textContent=employee.employee_name;

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review the employee and click Delete to confirm.","warning");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

window.employeeVoiceHandlers={
    add_employee:openEmployeeModal,
    update_employee:openUpdateEmployeeModal,
    delete_employee:openDeleteEmployeeModal
};