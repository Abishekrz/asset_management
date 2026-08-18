// Asset Functions

async function assetExists(serialNumber){
    const response=await fetch(
        `/asset/check-serial?serial_number=${encodeURIComponent(serialNumber)}`
    );

    const data=await response.json();

    if(!response.ok||!data.success){
        throw new Error(data.error||"Unable to check asset.");
    }

    return data.exists;
}

async function getAsset(assetId){
    const response=await fetch(`/asset/${assetId}`);

    const data=await response.json();

    if(!response.ok){
        throw new Error(data.error||"Asset not found.");
    }

    return data;
}

async function findAssetBySerial(serialNumber){
    try{
        const response=await fetch(
            `/asset/find-by-serial?serial_number=${encodeURIComponent(serialNumber)}`
        );

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

async function openAssetModal(args){
    try{

        if(await assetExists(args.serial_number)){
            showAiStatus("Asset already exists.","warning");
            return;
        }

        const form=document.getElementById("assetForm");
        const modal=document.getElementById("assetModal");

        form.reset();

        form.action="/asset/add";

        document.getElementById("asset_id").value="";
        document.getElementById("asset_name").value=args.asset_name||"";
        document.getElementById("serial_number").value=args.serial_number||"";
        document.getElementById("make").value=args.make||"";
        document.getElementById("model").value=args.model||"";
        document.getElementById("purchase_date").value=args.purchase_date||"";
        document.getElementById("purchase_price").value=args.purchase_price||"";

        const status=document.getElementById("status");
        if(status){
            status.value=args.status||"IN_STOCK";
        }

        const categoryId=document.getElementById("category_id");
        if(categoryId){
            categoryId.value=args.category_id||"";
        }

        document.getElementById("assetModalTitle").textContent="Add Asset";

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review asset details and click Save.","success");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openUpdateAssetModal(args){
    try{

        const currentAsset=await findAssetBySerial(args.current_serial_number||args.serial_number);

        if(!currentAsset){
            showAiStatus(`Asset "${args.current_serial_number||args.serial_number}" not found.`,"danger");
            return;
        }

        const asset=await getAsset(currentAsset.asset_id);

        const form=document.getElementById("assetForm");
        const modal=document.getElementById("assetModal");

        form.action=`/asset/edit/${asset.asset_id}`;

        document.getElementById("assetModalTitle").textContent="Edit Asset";

        document.getElementById("asset_id").value=asset.asset_id;
        document.getElementById("asset_name").value=args.asset_name||asset.asset_name;
        document.getElementById("serial_number").value=args.serial_number||asset.serial_number;
        document.getElementById("make").value=args.make||asset.make;
        document.getElementById("model").value=args.model||asset.model;
        document.getElementById("purchase_date").value=args.purchase_date||asset.purchase_date;
        document.getElementById("purchase_price").value=args.purchase_price||asset.purchase_price;

        const status=document.getElementById("status");
        if(status){
            status.value=args.status||asset.status;
        }

        const categoryId=document.getElementById("category_id");
        if(categoryId){
            categoryId.value=args.category_id||asset.category_id||"";
        }

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review the changes and click Save to confirm.","success");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openDeleteAssetModal(args){
    try{

        const asset=await findAssetBySerial(args.serial_number);

        if(!asset){
            showAiStatus(`Asset "${args.serial_number}" not found.`,"danger");
            return;
        }

        const form=document.getElementById("deleteAssetForm");
        const modal=document.getElementById("deleteAssetModal");

        form.action=`/asset/delete/${asset.asset_id}`;

        document.getElementById("delete_asset_id").value=asset.asset_id;
        document.getElementById("delete_asset_name").textContent=asset.asset_name;

        bootstrap.Modal.getOrCreateInstance(modal).show();

        showAiStatus("Review the asset and click Delete to confirm.","warning");

    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

window.assetVoiceHandlers={
    add_asset:openAssetModal,
    update_asset:openUpdateAssetModal,
    delete_asset:openDeleteAssetModal
};