$(document).ready(function() {
    console.log("JQuery operational!");

    const apiEndpoint = "http://localhost:5000";

    $.ajax({
        type: "GET",
        url: apiEndpoint + "/",   
        contentType: "application/json",
        success: function(result) {
            console.log(result);
        },
        error: function(response) {
            console.log(response);
        }
    })
});