function editAsset(id) {

    $.get("/asset/" + id, function (asset) {

        $("#modalTitle").text("Edit Asset");

        $("#asset_id").val(asset.asset_id);

        $("#asset_name").val(asset.asset_name);

        $("#serial_number").val(asset.serial_number);

        $("#make").val(asset.make);

        $("#model").val(asset.model);

        $("#purchase_date").val(asset.purchase_date);

        $("#purchase_price").val(asset.purchase_price);

        $("#category_id").val(asset.category_id);

        $("#warranty").val(asset.warranty);

        $("#assetForm")
            .attr("action", "/asset/edit/" + asset.asset_id);

        const modal = new bootstrap.Modal(
            document.getElementById("assetModal")
        );

        modal.show();

    });
}
    $("#assetModal").on("show.bs.modal", function (e) {

        if ($(e.relatedTarget).text().trim() === "Add Asset") {

            $("#modalTitle").text("Add Asset");

            $("#assetForm").trigger("reset");

            $("#asset_id").val("");

            $("#assetForm").attr("action", "/asset/add");

        }

    });
    $(document).ready(function () {
    // Run only on Asset List page
    if ($("#assetStatusFilter").length === 0) {
        return;
    }
    const table = $(".datatable").DataTable();
    function createFilter(selectId, columnIndex) {
        // Don't try to filter a column that doesn't exist
        if (columnIndex >= table.columns().count()) {
            console.error(`Column ${columnIndex} does not exist.`);
            return;
        }
        table.column(columnIndex).data().unique().sort().each(function (value) {
            if (value !== null && value !== "") {
                $(selectId).append(
                    `<option value="${value}">${value}</option>`
                );
            }
        });
        $(selectId).on("change", function () {
            table
                .column(columnIndex)
                .search($(this).val())
                .draw();
        });
    }
    createFilter("#makeFilter", 3);
    createFilter("#modelFilter", 4);
    createFilter("#assetStatusFilter", 7);
    createFilter("#categoryFilter", 8);
    createFilter("#warrantyFilter", 9);
});