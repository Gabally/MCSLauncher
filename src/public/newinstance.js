$(document).ready(() => {
    $("#new-instance-f").submit((e) => {
        e.preventDefault();
        $("#errors").empty();
        $("#loading-spinner").show();
        $("#cancel-btn").prop("disabled", true);
        $("#create-btn").prop("disabled", true);
        let form = $("#new-instance-f");
        $.ajax({
            type: "POST",
            url: "/api/createinstance",
            processData: false,
            contentType: false,
            data: new FormData(form[0]),
            success: (data) => {
                $(window.location).attr("href", "/");
            },
            error: (errMsg) => {
                $("#loading-spinner").hide();
                $("#cancel-btn").prop("disabled", false);
                $("#create-btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
    $("#world_file").change((e) => {
        $("#file-name").text(e.target.files[0].name);
    });
});