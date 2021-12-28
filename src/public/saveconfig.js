$(document).ready(() => {
    $("#save-btn").click((e) => {
        let data = {
            config: $("#conf-editor").val(),
        }
        $.ajax({
            type: "POST",
            url: `/api/saveconfig/${instanceName}`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data) => {
                $(window.location).attr("href", `/instance/${instanceName}`);
            },
            error: (errMsg) => {
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
});