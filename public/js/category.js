function editCategory(id) {
    $.get("/category/" + id, function (category) {
        $("#modalTitle").text("Edit Category");
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
$("#categoryModal").on("show.bs.modal",function (e){
    if ($(e.relatedTarget).text().trim()==="Add Category"){
        $("#modalTitle").text("Add Category");
        $("#categoryForm").trigger("reset");
        $("#category_id").val("");
        $("#categoryForm").attr("action","/category/add");
    }
});