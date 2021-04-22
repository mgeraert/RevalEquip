$(document).ready(function () {
    document.getElementById("change_pw").addEventListener("input", generateNewPasswordHash);
    document.getElementById("change_confirm_pw").addEventListener("input", generateConfirmPasswordHash);
});

function generateNewPasswordHash() {
    $("#new_pw_hash").val(sha256($("#change_pw").val()));
}

function generateConfirmPasswordHash() {
    $("#confirm_pw_hash").val(sha256($("#change_confirm_pw").val()));
}

function removeFlashNotification() {
    $(".notification").remove();
}