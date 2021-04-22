$(document).ready(function () {
    document.getElementById("login_password").addEventListener("input", generatePasswordHash);
});

function generatePasswordHash() {
    $("#login_pw_hash").val(sha256($("#login_password").val()));
}

function removeFlashNotification() {
    $(".notification").remove();
}