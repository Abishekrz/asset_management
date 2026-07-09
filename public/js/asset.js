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