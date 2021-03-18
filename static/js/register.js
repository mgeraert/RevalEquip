$(document).ready(function () {
    document.getElementById("register_password").addEventListener("input", generatePasswordHash);
});

function generatePasswordHash() {
    $("#register_pw_hash").val(MD5($("#register_password").val()));
}

function removeFlashNotification() {
    $(".notification").remove();
}