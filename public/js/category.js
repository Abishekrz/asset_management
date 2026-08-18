function editCategory(id) {
    $.get("/category/" + id, function (category) {
        $("#categoryModalTitle").text("Edit Category");
        $("#category_id").val(category.category_id);
        $("#category_name").val(category.category_name);
        $("#categoryForm").attr(
            "action",
            "/category/edit/" + category.category_id
        );
        const modal = new bootstrap.Modal(
            document.getElementById("categoryModal")
        );
        modal.show();
    });

}

function deleteCategory(categoryId,categoryName){

    const form=document.getElementById("deleteCategoryForm");

    form.action=`/category/delete/${categoryId}`;

    document.getElementById("delete_category_id").value=categoryId;

    document.getElementById("delete_category_name").textContent=categoryName;

    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById("deleteCategoryModal")
        )
        .show();
}

$("#categoryModal").on("show.bs.modal",function (e){
    if ($(e.relatedTarget).text().trim()==="Add Category"){
        $("#categoryModalTitle").text("Add Category");
        $("#categoryForm").trigger("reset");
        $("#category_id").val("");
        $("#categoryForm").attr("action","/category/add");
    }
});

$("#categoryForm").on("submit", async function (event) {
    const form = this;

    if (!form.action.endsWith("/category/add")) {
        return;
    }

    event.preventDefault();

    try {
        const categoryName = $("#category_name").val();
        const response = await fetch(
            `/category/check-name?category_name=${encodeURIComponent(categoryName)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Unable to check the category name.");
        }

        if (data.exists) {
            alert("Category already exists.");
            return;
        }

        form.submit();
    } catch (err) {
        alert(err.message);
    }
});
