function editScrape(id) {
    $.get("/scrape/" + id, function (scrape) {
        // console.log(scrape);
        $("#modalTitle").text("Edit Scrap Details");
        $("#edit_scrape_id").val(scrape.scrape_id);
        $("#edit_asset_id").val(scrape.asset_id);
        $("#edit_scrape_date").val(scrape.scrape_date);
        $("#edit_reason").val(scrape.reason);
        $("#editScrapeForm")
            .attr("action", "/scrape/edit/" + scrape.scrape_id);
        const modal = new bootstrap.Modal(
            document.getElementById("editScrapeModal")
        );
        modal.show();
    });
}
$("#scrapeModal").on("show.bs.modal", function (e) {
    if ($(e.relatedTarget).text().trim() === "Add Scrap Details") {
        $("#modalTitle").text("Add Scrap Details");
        $("#scrapeForm").trigger("reset");
        $("#scrape_id").val("");
        $("#scrapeForm").attr("action", "/scrape/add");
    }
});