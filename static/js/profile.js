var g_currentUser;

$(document).ready(function () {
    $("#menu_title").text("My profile");

    $.get("/users/get-logged-in-users-data?", function (data, status) {
        g_currentUser = JSON.parse(data)[0];

        setCurrentUserInputs();
    });
});

function setCurrentUserInputs() {
    $("#user_last_name").val(g_currentUser.user_last_name);
    $("#user_name").val(g_currentUser.user_name);
    if (g_currentUser.user_sex == "m") {
        $("#user_sex").val("m").change();
    } else if (g_currentUser.user_sex == "v") {
        $("#user_sex").val("v").change();
    } else {
        $("#user_sex").val("x").change();
    }
    if (g_currentUser.user_is_pi == 1) {
        $("#user_is_pi").prop("checked", true);
    } else {
        $("#user_is_pi").prop("checked", false);
    }
    if (g_currentUser.user_is_phd == 1) {
        $("#user_is_phd").prop("checked", true);
    } else {
        $("#user_is_phd").prop("checked", false);
    }
    $("#user_title").val(g_currentUser.user_title);
    $("#user_category").val(g_currentUser.user_category);
    $("#user_function").val(g_currentUser.user_function);
    $("#user_email").val(g_currentUser.user_email);
    $("#user_home_address").val(g_currentUser.user_home_address);
    $("#user_telephone").val(g_currentUser.user_telephone);
    $("#user_private_phone").val(g_currentUser.user_private_phone);

    if (g_currentUser.user_in_date != "-1") {
        var inDate = g_currentUser.user_in_date.split("/");
        if (inDate[0].length == 1) {
            $("#user_in_date").val(inDate[2] + '-' + inDate[1] + '-0' + inDate[0]);
        } else {
            $("#user_in_date").val(inDate[2] + '-' + inDate[1] + '-' + inDate[0]);
        }
    } else {
        $("#user_in_date").val("");
    }

    if (g_currentUser.user_out_date != "-1") {
        var outDate = g_currentUser.user_out_date.split("/");
        if (outDate[0].length == 1) {
            $("#user_out_date").val(outDate[2] + '-' + outDate[1] + '-' + outDate[0]);
        } else {
            $("#user_out_date").val(outDate[2] + '-' + outDate[1] + '-' + outDate[0]);
        }
    } else {
        $("#user_out_date").val("");
    }
}

function updateProfile() {

    var ID = g_currentUser.ID;
    argString = "?ID=" + ID;

    var user_last_name = $("#user_last_name").val();
    argString = argString + "&user_last_name=" + user_last_name.toUpperCase();

    var user_name = "";
    if ($("#user_name").val() != "") {
        var name = $("#user_name").val().split(' ');
        for (i = 0; i < name.length; i++) {
            for (j = 0; j < name[i].length; j++) {
                if (j == 0) {
                    user_name = user_name + name[i][j].toUpperCase();
                } else {
                    user_name = user_name + name[i][j];
                }
            }
            user_name = user_name + " ";
        }
        user_name = user_name.slice(0, -1);
    }
    argString = argString + "&user_name=" + user_name;

    var user_sex = $("#user_sex").val();
    argString = argString + "&user_sex=" + user_sex;

    var is_pi = $("#user_is_pi").is(':checked');
    if (is_pi == true) {
        user_is_pi = 1;
        argString = argString + "&user_is_pi=" + user_is_pi;
    } else {
        if (g_currentUser.user_is_pi == 1 || g_currentUser.user_is_pi == 0) {
            user_is_pi = 0;
        } else {
            user_is_pi = "";
        }
        argString = argString + "&user_is_pi=" + user_is_pi;
    }

    var is_phd = $("#user_is_phd").is(':checked');
    if (is_phd == true) {
        user_is_phd = 1;
        argString = argString + "&user_is_phd=" + user_is_phd;
    } else {
        if (g_currentUser.user_is_phd == 1 || g_currentUser.user_is_phd == 0) {
            user_is_phd = 0;
        } else {
            user_is_phd = "";
        }
        argString = argString + "&user_is_phd=" + user_is_phd;
    }

    var user_title = $("#user_title").val();
    argString = argString + "&user_title=" + user_title;

    var user_category = $("#user_category").val();
    argString = argString + "&user_category=" + user_category;

    var user_function = $("#user_function").val();
    argString = argString + "&user_function=" + user_function;

    var user_email = $("#user_email").val();
    argString = argString + "&user_email=" + user_email;

    var user_home_address = $("#user_home_address").val();
    argString = argString + "&user_home_address=" + user_home_address;

    var user_telephone = $("#user_telephone").val();
    argString = argString + "&user_telephone=" + user_telephone;

    var user_private_phone = $("#user_private_phone").val();
    argString = argString + "&user_private_phone=" + user_private_phone;

    if ($("#user_in_date").val() == "") {
        argString = argString + "&user_in_date=-1";
    } else {
        var user_in_date = $("#user_in_date").val().split("-");
        argString = argString + "&user_in_date=" + user_in_date[2] + '/' + user_in_date[1] + '/' + user_in_date[0];
    }

    if ($("#user_out_date").val() == "") {
        argString = argString + "&user_out_date=-1";
    } else {
        var user_out_date = $("#user_out_date").val().split("-");
        argString = argString + "&user_out_date=" + user_out_date[2] + '/' + user_out_date[1] + '/' + user_out_date[0];
    }

    $.get("/profile/update" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            location.reload();
        } else if (data.localeCompare("http400") == 0) {
            if (user_last_name == "") {
                giveInputWarning("user_last_name");
            }
            if (user_name == "") {
                giveInputWarning("user_name");
            }
            if (user_email == "") {
                giveInputWarning("user_email");
            }
            if (user_telephone == "") {
                giveInputWarning("user_telephone");
            }
        }
    });
}

function giveInputWarning(inputID) {
    // console.log('#' + inputID)
    var input = $('#' + inputID);

    input.css("border-color", "#BA604D");
    input.css("transition", "0.2s");

    setTimeout(function () {
        input.css("border-color", "");
    }, 1500);
}

function removeFlashNotification() {
    $(".notification").remove();
}