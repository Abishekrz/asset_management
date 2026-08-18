async function openCategoryModal(args){
    try{
        if(await categoryExists(args.category_name)){
            showAiStatus("Category already exists.","warning");
            return;
        }
        const form=document.getElementById("categoryForm");
        const modal=document.getElementById("categoryModal");
        form.reset();
        form.action="/category/add";
        document.getElementById("category_id").value="";
        document.getElementById("category_name").value=args.category_name||"";
        document.getElementById("categoryModalTitle").textContent="Add Category";
        document.activeElement.blur();
        bootstrap.Modal.getOrCreateInstance(categoryModal).hide();
        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review category and click Save.","success");
    }catch(err){
        showAiStatus(err.message,"danger");
    }
}
async function openUpdateCategoryModal(args){
    try{
        const currentCategory=await findCategoryByName(args.current_category_name);
        if(!currentCategory){
            showAiStatus(`Category "${args.current_category_name}" not found.`,"danger");
            return;
        }
        const duplicateCategory=await findCategoryByName(args.category_name);
        if(
            duplicateCategory &&
            duplicateCategory.category_id!==currentCategory.category_id
        ){
            showAiStatus(`Category "${args.category_name}" already exists.`,"warning");
            return;
        }
        const form=document.getElementById("categoryForm");
        const modal=document.getElementById("categoryModal");
        form.action=`/category/edit/${currentCategory.category_id}`;
        document.getElementById("categoryModalTitle").textContent="Edit Category";
        document.getElementById("category_id").value=currentCategory.category_id;
        document.getElementById("category_name").value=args.category_name;
        bootstrap.Modal.getOrCreateInstance(modal).show();
        showAiStatus("Review the changes and click Save to confirm.","success");
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}
// Delete Category
async function openDeleteCategoryModal(args){
    try{
        const category=await findCategoryByName(args.category_name);
        if(!category){
            showAiStatus(`Category "${args.category_name}" not found.`,"danger");
            return;
        }
        const modal=document.getElementById("deleteCategoryModal");
        const hiddenId=document.getElementById("delete_category_id");
        const name=document.getElementById("delete_category_name");
        console.log({modal, hiddenId, name});
        if(!modal){
            throw new Error("deleteCategoryModal not found");
        }
        if(!hiddenId){
            throw new Error("delete_category_id not found");
        }
        if(!name){
            throw new Error("delete_category_name not found");
        }
        hiddenId.value=category.category_id;
        name.textContent=category.category_name;
        bootstrap.Modal.getOrCreateInstance(modal).show();
    }catch(err){
        console.error(err);
        showAiStatus(err.message,"danger");
    }
}
// Category Functions
async function categoryExists(categoryName){
    const response=await fetch(
        `/category/check-name?category_name=${encodeURIComponent(categoryName)}`
    );
    const data=await response.json();
    if(!response.ok||!data.success){
        throw new Error(data.error||"Unable to check category.");
    }
    return data.exists;
}

async function getCategory(categoryId){
    const response=await fetch(`/category/${categoryId}`);
    const data=await response.json();
    if(!response.ok){
        throw new Error(data.error||"Category not found.");
    }
    return data;
}

async function findCategoryByName(categoryName){
    try{
        const response=await fetch(
            `/category/find-by-name?category_name=${encodeURIComponent(categoryName)}`
        );
        if(response.status===404){
            return null;
        }
        if(!response.ok){
            throw new Error("Unable to search category.");
        }
        const result=await response.json();
        return result.success ? result.data : null;
    }catch(err){
        // console.error(err);
        return null;
    }
}

window.categoryVoiceHandlers={
    add_category:openCategoryModal,
    update_category:openUpdateCategoryModal,
    delete_category:openDeleteCategoryModal
};