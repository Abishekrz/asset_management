// Scrape Functions

async function scrapeExists(scrapeId){
    const response=await fetch(`/scrape/${scrapeId}`);
    const data=await response.json();
    if(!response.ok){
        return false;
    }
    return Boolean(data.scrape_id);
}

async function getScrape(scrapeId){
    const response=await fetch(`/scrape/${scrapeId}`);
    const data=await response.json();
    if(!response.ok){
        throw new Error(data.message||"Scrape not found.");
    }
    return data;
}

async function findScrape(args){
    try{
        const asset = await findAssetBySerial(args.serial_number||args.asset_serial||"");
        if(!asset){
            return null;
        }
        const response=await fetch(`/scrape/find?asset_id=${asset.asset_id}`);
        const data=await response.json();
        if(!response.ok){
            return null;
        }
        return data.scrape || null;
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

async function openScrapeModal(args){
    try{
        const asset=await findAssetBySerial(args.serial_number||args.asset_serial||"");
        if(!asset){
            showAiStatus("Asset not found.","warning");
            return;
        }
        if(asset.status==="SCRAPPED"){
            showAiStatus("Asset is already scrapped.","warning");
            return;
        }

        const form=document.getElementById("scrapeForm");
        const modal=document.getElementById("scrapeModal");

        form.reset();
        form.action="/scrape/add";

        document.getElementById("scrape_id").value="";
        document.getElementById("asset_id").value=asset.asset_id;
        document.getElementById("scrape_date").value=args.scrape_date||"";
        document.getElementById("reason").value=args.reason||"";

        document.getElementById("scrapeModalTitle").textContent="Scrape Details";

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review scrape details and click Save.","success");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openUpdateScrapeModal(args){
    try{
        const scrape=await findScrape(args);
        if(!scrape){
            showAiStatus("Scrape record not found.","warning");
            return;
        }

        const form=document.getElementById("scrapeForm");
        const modal=document.getElementById("scrapeModal");

        form.action=`/scrape/edit/${scrape.scrape_id}`;
        document.getElementById("scrapeModalTitle").textContent="Edit Scrap";
        document.getElementById("scrape_id").value=scrape.scrape_id;
        document.getElementById("asset_id").value=scrape.asset_id;
        document.getElementById("scrape_date").value=scrape.scrape_date||"";
        document.getElementById("reason").value=args.reason||scrape.reason||"";

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review the scrape details and click Save to confirm.","success");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

async function openDeleteScrapeModal(args){
    try{
        const scrape=await findScrape(args);
        if(!scrape){
            showAiStatus("Scrape record not found.","warning");
            return;
        }

        const form=document.getElementById("deleteScrapeForm");
        const modal=document.getElementById("deleteScrapeModal");

        form.action=`/scrape/delete/${scrape.scrape_id}`;
        document.getElementById("delete_scrape_id").value=scrape.scrape_id;
        document.getElementById("delete_scrape_name").textContent=scrape.asset_name||scrape.asset_id;

        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review the scrape and click Delete to confirm.","warning");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}

window.scrapeVoiceHandlers={
    add_scrape:openScrapeModal,
    update_scrape:openUpdateScrapeModal,
    delete_scrape:openDeleteScrapeModal
};