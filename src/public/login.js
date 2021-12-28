$(document).ready(() => {
    $("#login").submit((e) => {
        e.preventDefault();
        let data = {
            username: $("#username").val(),
            password: $("#password").val()
        }
        $("#login-btn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (data) => {
                $(window.location).attr("href", "/");
            },
            error: (errMsg) => {
                $("#login-btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
});