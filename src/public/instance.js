$(document).ready(() => {
    $("#del-inst").click((e) => {
        if (!confirm("Are you sure you want to delete this instance?")) {
            return;
        }
        e.preventDefault();
        $(".btn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: `/api/deleteinstance/${window.instanceName}`,
            success: (data) => {
                $(window.location).attr("href", "/");
            },
            error: (errMsg) => {
                $(".btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
    $("#start-inst").click((e) => {
        $(".btn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: `/api/startinstance/${window.instanceName}`,
            success: (data) => {
                $(".btn").prop("disabled", false);
            },
            error: (errMsg) => {
                $(".btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
    $("#stop-inst").click((e) => {
        $(".btn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: `/api/stopinstance/${window.instanceName}`,
            success: (data) => {
                $(".btn").prop("disabled", false);
            },
            error: (errMsg) => {
                $(".btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
    $("#kill-inst").click((e) => {
        $(".btn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: `/api/killinstance/${window.instanceName}`,
            success: (data) => {
                $(".btn").prop("disabled", false);
            },
            error: (errMsg) => {
                $(".btn").prop("disabled", false);
                $("#errors").empty();
                $("<div></div>").text(errMsg.responseJSON.message).appendTo("#errors");
            }
        });
    });
    let ws = new WebSocket(`${ window.location.protocol == "http:" ? "ws" : "wss" }://${window.location.host}/?instance=${window.instanceName}`);
    ws.addEventListener("message", (e) => {
        let msg = JSON.parse(e.data);
        switch (msg.type) {
            case "change":
                window.location.reload();
                break;
            case "stdout":
                $("#console").append(msg.out).animate({ scrollTop: $("#console").prop("scrollHeight") - $("#console").height() }, 50);
        }
    });
    $("#prompt").keypress((event) => {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == "13") {
            ws.send(JSON.stringify({
                type: "command",
                content: $("#prompt").val()
            }));
            $("#prompt").val("");
        }
        event.stopPropagation();
    });
});