function editScrape(id) {
    $.get("/scrape/" + id, function (scrape) {
        $("#modalTitle").text("Edit Scrap");
        $("#scrape_id").val(scrape.scrape_id);
        $("#asset_id").val(scrape.asset_id);
        $("#scrape_date").val(scrape.scrape_date);
        $("#reason").val(scrape.reason);
        $("#scrapeForm")
            .attr("action", "/scrape/edit/" + scrape.scrape_id);
        const modal = new bootstrap.Modal(
            document.getElementById("scrapeModal")
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