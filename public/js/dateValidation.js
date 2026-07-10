$(document).ready(function () {

    const today = new Date().toISOString().split("T")[0];

    $("#purchase_date").attr("max", today);
    $("#issue_date").attr("max", today);
    $("#return_date").attr("max", today);
    $("#scrape_date").attr("max", today);
    $("#joined_at").attr("max", today);

    $("#edit_purchase_date").attr("max", today);
    $("#edit_issue_date").attr("max", today);
    $("#edit_return_date").attr("max", today);
    $("#edit_scrape_date").attr("max", today);
    $("#edit_joined_at").attr("max", today);


});