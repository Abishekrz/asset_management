// Issue Functions

async function issueExists(issueId){
    const response=await fetch(`/issue/${issueId}`);
    const data=await response.json();
    if(!response.ok){
        return false;
    }
    return Boolean(data.issue_id);
}

async function getIssue(issueId){
    const response=await fetch(`/issue/${issueId}`);
    const data=await response.json();
    if(!response.ok){
        throw new Error(data.message||"Issue not found.");
    }
    return data;
}

async function findIssue(args){
    try{
        const asset = await findAssetBySerial(args.serial_number||args.asset_serial||args.asset_name||"");
        if(!asset){
            return null;
        }
        const response=await fetch(`/issue/find?asset_id=${asset.asset_id}`);
        const data=await response.json();
        if(!response.ok){
            return null;
        }
        return data.issue || null;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function findAssetBySerial(serialNumber){
    try{
        const response=await fetch(`/asset/find-by-serial?serial_number=${encodeURIComponent(serialNumber)}`);
        if(response.status===404){
            return null;
        }
        if(!response.ok){
            throw new Error("Unable to search asset.");
        }
        const result=await response.json();
        return result.success ? result.data : null;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function findEmployeeByName(employeeName){
    try{
        const response=await fetch(`/employee/find-by-name?employee_name=${encodeURIComponent(employeeName)}`);
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

async function openIssueModal(args){
    try{
        const employee=await findEmployeeByName(args.employee_name||args.employee||"");
        if(!employee){
            showAiStatus("Employee not found.","warning");
            return;
        }

        const asset=await findAssetBySerial(args.serial_number||args.asset_serial||"");
        if(!asset){
            showAiStatus("Asset not found.","warning");
            return;
        }

        if(asset.status!=="IN_STOCK"){
            showAiStatus("Asset is already issued.","warning");
            return;
        }

        const form=document.getElementById("issueForm");
        const modal=document.getElementById("issueModal");

        form.reset();
        form.action="/issue/issue";

        document.getElementById("issue_id").value="";
        document.getElementById("employee_id").value=employee.employee_id;
        document.getElementById("asset_id").value=asset.asset_id;
        document.getElementById("issue_date").value=args.issue_date||"";
        document.getElementById("expected_return_date").value=args.expected_return_date||"";
        document.getElementById("status").value=args.status||"ISSUED";
        document.getElementById("reason").value=args.reason||"";

        document.getElementById("issueModalTitle").textContent="Issue Asset";

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review issue details and click Save.","success");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openUpdateIssueModal(args){
    try{
        const issue=await findIssue(args);
        if(!issue){
            showAiStatus("Issue not found.","warning");
            return;
        }

        const form=document.getElementById("issueForm");
        const modal=document.getElementById("issueModal");

        form.action=`/issue/edit/${issue.issue_id}`;
        document.getElementById("issueModalTitle").textContent="Edit Issue";
        document.getElementById("issue_id").value=issue.issue_id;
        document.getElementById("employee_id").value=issue.employee_id;
        document.getElementById("asset_id").value=issue.asset_id;
        document.getElementById("issue_date").value=issue.issue_date||"";
        document.getElementById("expected_return_date").value=issue.expected_return_date||issue.return_date||"";
        document.getElementById("status").value=args.status||issue.status||"ISSUED";
        document.getElementById("reason").value=args.reason||issue.reason||"";

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review the issue and click Save to confirm.","success");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openDeleteIssueModal(args){
    try{
        const issue=await findIssue(args);
        if(!issue){
            showAiStatus("Issue not found.","warning");
            return;
        }

        const form=document.getElementById("deleteIssueForm");
        const modal=document.getElementById("deleteIssueModal");

        form.action=`/issue/delete/${issue.issue_id}`;
        document.getElementById("delete_issue_id").value=issue.issue_id;
        document.getElementById("delete_issue_name").textContent=issue.asset_name||issue.asset_id;

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review the issue and click Delete to confirm.","warning");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

window.issueVoiceHandlers={
    add_issue:openIssueModal,
    update_issue:openUpdateIssueModal,
    delete_issue:openDeleteIssueModal
};