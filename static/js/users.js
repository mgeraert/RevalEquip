var g_users;
var g_selectedUser;
var g_selectedRow = -1;

var g_currentUser;

var g_imageDirectory = "static\\images\\";

$(document).ready(function () {
    $("#menu_title").text("Users");

    $.get("/users/get-permissions-by-id?" + $("#current_user_id").text(), function (data, status) {
        g_currentUser = JSON.parse(data)[0];
        getUsers();
    });
});

// GENERATE USERS TABLE -----------------------------------------------------------------------------------------------
function getUsers(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/users/get", function (data, status) {
        g_users = JSON.parse(data);
        if (g_users.length > 0) {
            tableHTML = "<table id='blue_table' class='table_design table-sortable'>"
            tableHTML = tableHTML.concat(generateTableHeader());
            tableHTML = tableHTML.concat("<tbody>");
            $.each(g_users, function (i, item) {
                tableHTML = tableHTML.concat(generateTabelRow(i + 1, item));
            });
            tableHTML = tableHTML.concat("<tbody>");
            tableHTML = tableHTML.concat("</table>");

            $("#users_table").html(tableHTML);
            // addRowHandlers();
            if (enableSort) {
                sortTableByColumn(document.querySelector("table"), sortColumn, sortAsc);
            }
            if (enableSelectedRow) {
                selectRowUser(g_selectedRow);
            }
        }
    });
}

function generateTableHeader() {
    out = "<thead><tr>";

    out = out.concat("<th onclick='sortColumnUser(0)'>");
    out = out.concat("#");
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnUser(1)'>");
    out = out.concat('Name');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnUser(2)'>");
    out = out.concat('Category');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnUser(3)'>");
    out = out.concat('Function');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnUser(4)'>");
    out = out.concat('Email');
    out = out.concat("</th>");

    out = out.concat("</tr></thead>");

    return out;
}

function generateTabelRow(rowNr, user) {

    out = "<tr onclick='selectRowUser(this)'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(rowNr.toString(), 32, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name, 300, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_category, 100, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_function, 300, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_email, 300, rowNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function getTableDiv(content, width, rowNr) {
    out = "";

    if (content == null) {
        content = '';
    }

    out = '<div style="overflow:hidden; width:' + width.toString() + 'px;">';
    out = out.concat(content);
    out = out.concat('</div>');
    return out;
}
// --------------------------------------------------------------------------------------------------------------------

// DO .... WHEN USER GETS SELECTED ------------------------------------------------------------------------------------
function selectRowUser(row) {
    clearTextBox();
    loadSelectedData(row);
    generatePicture();
}
// --------------------------------------------------------------------------------------------------------------------

// LOAD PROFILE PICTURE OF SELECTED USER  -----------------------------------------------------------------------------
function generatePicture() {
    $.get("/users-files/get-by-user-id?user_id=" + g_selectedUser.ID, function (data, status) {
        pictures = JSON.parse(data);
        if (pictures.length == 0) {
            $('#picture_button').hide();
        } else {
            var picture = pictures[0];

            var picture_name = picture.picture_name;
            var picturePopUpHTML = '';
            $("#picture_pop_up").html(picturePopUpHTML);
            picturePopUpHTML = picturePopUpHTML.concat('<span class="close cursor" onclick="closePicturePopUp()">×</span>');
            picturePopUpHTML = picturePopUpHTML.concat('<div class="picture_pop_up-content">');
            picturePopUpHTML = picturePopUpHTML.concat('<div class="picture_pop_up-picture" style="display: block;"><img title="' + picture_name + '" src="' + g_imageDirectory + 'upload\\' + picture_name + '"></div>');
            picturePopUpHTML = picturePopUpHTML.concat('</div>');
            $("#picture_pop_up").html(picturePopUpHTML);

            $('#picture_button').show();
        }

    });
}

function openProfilePicture() {
    document.getElementById("picture_pop_up").style.display = "block";
}

function closeProfilePicture() {
    document.getElementById("picture_pop_up").style.display = "none";
}
// --------------------------------------------------------------------------------------------------------------------

// LOAD INPUT VALUES --------------------------------------------------------------------------------------------------
function loadSelectedData(row) {
    if (typeof row == 'number') {
        rowNr = row
    } else {
        rowNr = row.rowIndex;
    }

    var rowNr_data = getJSONFromTable(rowNr);

    var table = document.getElementById("users_table");
    var rows = table.getElementsByTagName("tr");

    if (g_selectedRow > -1 && g_selectedRow < rows.length) {
        var table_temp = document.querySelector("table");
        const tBody = table_temp.tBodies[0];
        const rows_temp = Array.from(tBody.querySelectorAll("tr"));
        rows_temp.forEach(tr => tr.classList.remove("active-row"));
    }
    selectedRow = rows[rowNr];
    selectedRow.classList.add("active-row");
    g_selectedRow = rowNr;
    g_selectedUser = g_users[rowNr_data - 1];

    $("#user_last_name").val(g_selectedUser.user_last_name);
    $("#user_name").val(g_selectedUser.user_name);
    if (g_selectedUser.user_sex == "m") {
        $("#user_sex").val("m").change();
    } else if (g_selectedUser.user_sex == "v") {
        $("#user_sex").val("v").change();
    } else {
        $("#user_sex").val("x").change();
    }

    $("#user_title").val(g_selectedUser.user_title);
    $("#user_category").val(g_selectedUser.user_category);
    $("#user_function").val(g_selectedUser.user_function);

    $("#user_email").val(g_selectedUser.user_email);
    $("#user_home_address").val(g_selectedUser.user_home_address);

    $("#user_telephone").val(g_selectedUser.user_telephone);
    $("#user_private_phone").val(g_selectedUser.user_private_phone);

    if (g_selectedUser.user_in_date != "-1") {
        var inDate = g_selectedUser.user_in_date.split("/");
        if (inDate[0].length == 1) {
            $("#user_in_date").val(inDate[2] + '-' + inDate[1] + '-0' + inDate[0]);
        } else {
            $("#user_in_date").val(inDate[2] + '-' + inDate[1] + '-' + inDate[0]);
        }
    } else {
        $("#user_in_date").val("");
    }
    if (g_selectedUser.user_out_date != "-1") {
        var outDate = g_selectedUser.user_out_date.split("/");
        if (outDate[0].length == 1) {
            $("#user_out_date").val(outDate[2] + '-' + outDate[1] + '-0' + outDate[0]);
        } else {
            $("#user_out_date").val(outDate[2] + '-' + outDate[1] + '-' + outDate[0]);
        }
    } else {
        $("#user_out_date").val("");
    }
    if (g_selectedUser.user_is_pi == 1) {
        $("#user_is_pi").prop("checked", true);
    } else {
        $("#user_is_pi").prop("checked", false);
    }
    if (g_selectedUser.user_is_phd == 1) {
        $("#user_is_phd").prop("checked", true);
    } else {
        $("#user_is_phd").prop("checked", false);
    }

    if (g_selectedUser.user_is_financial_team == 1) {
        $("#user_is_financial_team").prop("checked", true);
    } else {
        $("#user_is_financial_team").prop("checked", false);
    }
    if (g_selectedUser.user_is_admin == 1) {
        $("#user_is_admin").prop("checked", true);
    } else {
        $("#user_is_admin").prop("checked", false);
    }
    if (g_selectedUser.user_is_lender == 1) {
        $("#user_is_lender").prop("checked", true);
    } else {
        $("#user_is_lender").prop("checked", false);
    }
    if (g_selectedUser.user_is_lender_admin == 1) {
        $("#user_is_lender_admin").prop("checked", true);
    } else {
        $("#user_is_lender_admin").prop("checked", false);
    }
    if (g_selectedUser.user_is_owner == 1) {
        $("#user_is_owner").prop("checked", true);
    } else {
        $("#user_is_owner").prop("checked", false);
    }

    if (g_selectedUser.user_date_when_allowed != "-1") {
        var dateWhenAllowed = g_selectedUser.user_date_when_allowed.split("/");
        if (dateWhenAllowed[0].length == 1) {
            $("#user_date_when_allowed").val(dateWhenAllowed[2] + '-' + dateWhenAllowed[1] + '-0' + dateWhenAllowed[0]);
        } else {
            $("#user_date_when_allowed").val(dateWhenAllowed[2] + '-' + dateWhenAllowed[1] + '-' + dateWhenAllowed[0]);
        }
    } else {
        $("#user_date_when_allowed").val("");
    }
    if (g_selectedUser.user_completed_profile == 1) {
        $("#user_completed_profile").prop("checked", true);
    } else {
        $("#user_completed_profile").prop("checked", false);
    }
    if (g_selectedUser.user_is_allowed == 1) {
        $("#user_is_allowed").prop("checked", true);
    } else {
        $("#user_is_allowed").prop("checked", false);
    }
    if (g_selectedUser.user_set_pw == 1) {
        $("#user_set_pw").prop("checked", true);
    } else {
        $("#user_set_pw").prop("checked", false);
    }
}
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
function getJSONFromTable(rowNr) {
    var table = document.getElementById('blue_table').tBodies[0];
    var jsonArr = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
        var col = row.cells;
        var jsonObj = {
            elem: col[0].innerHTML
        }

        jsonArr.push(jsonObj);
    }

    var ID = getNumbersFromString(jsonArr[rowNr - 1].elem)[1];
    return ID;
}

function getNumbersFromString(string) {
    var regex = /\d+/g;
    var matches = string.match(regex);
    return matches;
}
// --------------------------------------------------------------------------------------------------------------------

// SORTING TABLE ------------------------------------------------------------------------------------------------------
function sortTableByColumn(table, column, asc = true) {
    // https://www.youtube.com/watch?v=8SL_hM1a0yo
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    var inputType;
    if (column == 0) {
        inputType = "numbers";
    } else {
        inputType = "names";
    }

    // sort each row
    const sortedRows = rows.sort((a, b) => {
        if (inputType == "names") {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        } else {
            const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            return parseFloat(aColText) > parseFloat(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
        }
    });
    for (i = 0; i < sortedRows.length; i++) {
        var innerText = sortedRows[i].innerText.split("\n\t\n");
        var name = innerText[1];
        // console.log(i, sortedRows[i].innerText.split("\n\t\n")[0], name);
        if (g_selectedUser != undefined) {
            if (name == g_selectedUser.user_name) {
                g_selectedRow = i + 1;
            }
        }
    }
    // console.log(g_selectedRow - 1);

    // remove all resisting tr from table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // add sorted rows
    tBody.append(...sortedRows);

    // remember current sorting type (asc or decs)
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

function sortColumnUser(column) {
    var table = document.querySelector("table");
    var currentIsAscending = table.querySelectorAll("th")[column].className;
    if (currentIsAscending == "") {
        sortTableByColumn(table, column);
    } else if (currentIsAscending == "th-sort-desc") {
        sortTableByColumn(table, column, true);
    } else {
        sortTableByColumn(table, column, false);
    }
}
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
function clearTextBox() {
    $("#user_last_name").val("");
    $("#user_name").val("");
    $("#user_sex").val("x").change();

    $("#user_title").val("");
    $("#user_category").val("");
    $("#user_function").val("");

    $("#user_email").val("");
    $("#user_home_address").val("");

    $("#user_telephone").val("");
    $("#user_private_phone").val("");

    $("#user_in_date").val("");
    $("#user_out_date").val("");
    $("#user_is_pi").prop("checked", false);
    $("#user_is_phd").prop("checked", false);
    $("#picture_button").hide();

    $("#user_is_financial_team").prop("checked", false);
    $("#user_is_admin").prop("checked", false);
    $("#user_is_lender").prop("checked", false);
    $("#user_is_lender_admin").prop("checked", false);
    $("#user_is_owner").prop("checked", false);
}

function deselectUsers() {
    g_selectedUser = undefined;
    g_selectedRow = -1;
}
// --------------------------------------------------------------------------------------------------------------------

// UPDATE SELECTED USER -----------------------------------------------------------------------------------------------
function updateUser() {
    if (g_selectedUser == undefined) {
        showToast("Please select a user.");
        return;
    }

    var ID = g_selectedUser.ID;
    argString = "?ID=" + ID;

    var user_last_name = $("#user_last_name").val();
    argString = argString + "&user_last_name=" + user_last_name;

    var user_name = $("#user_name").val();
    argString = argString + "&user_name=" + user_name;

    var user_sex = $("#user_sex").val();
    argString = argString + "&user_sex=" + user_sex;

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

    var is_pi = $("#user_is_pi").is(':checked');
    if (is_pi == true) {
        var user_is_pi = 1;
        argString = argString + "&user_is_pi=" + user_is_pi;
    } else {
        if (g_selectedUser.user_is_pi == 1 || g_selectedUser.user_is_pi == 0) {
            var user_is_pi = 0;
        } else {
            var user_is_pi = "";
        }
        argString = argString + "&user_is_pi=" + user_is_pi;
    }

    var is_phd = $("#user_is_phd").is(':checked');
    if (is_phd == true) {
        var user_is_phd = 1;
        argString = argString + "&user_is_phd=" + user_is_phd;
    } else {
        if (g_selectedUser.user_is_phd == 1 || g_selectedUser.user_is_phd == 0) {
            var user_is_phd = 0;
        } else {
            var user_is_phd = "";
        }
        argString = argString + "&user_is_phd=" + user_is_phd;
    }

    var is_financial_team = $("#user_is_financial_team").is(':checked');
    if (is_financial_team == true) {
        argString = argString + "&user_is_financial_team=" + 1;
    } else {
        argString = argString + "&user_is_financial_team=" + 0;
    }

    var is_admin = $("#user_is_admin").is(':checked');
    if (is_admin == true) {
        argString = argString + "&user_is_admin=" + 1;
    } else {
        argString = argString + "&user_is_admin=" + 0;
    }

    var is_lender = $("#user_is_lender").is(':checked');
    if (is_lender == true) {
        argString = argString + "&user_is_lender=" + 1;
    } else {
        argString = argString + "&user_is_lender=" + 0;
    }

    var is_lender_admin = $("#user_is_lender_admin").is(':checked');
    if (is_lender_admin == true) {
        argString = argString + "&user_is_lender_admin=" + 1;
    } else {
        argString = argString + "&user_is_lender_admin=" + 0;
    }

    var is_owner = $("#user_is_owner").is(':checked');
    if (is_owner == true) {
        argString = argString + "&user_is_owner=" + 1;
    } else {
        argString = argString + "&user_is_owner=" + 0;
    }

    if (g_selectedRow > -1) {
        $.get("/users/update" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                showToast("Selected user has been updated.");

                var table_temp = document.querySelector("table");
                const tHead = table_temp.tHead;
                var column = '';
                tHead.querySelectorAll("th").forEach(th => {
                    if (th.classList.contains("th-sort-asc") == true || th.classList.contains("th-sort-desc")) {
                        column = th;
                    }
                });
                if (column != '') {
                    var columnNr = parseInt(getNumbersFromString(column.getAttribute('onclick'))[0]);
                    if (column.classList[0] == "th-sort-asc") {
                        getUsers(true, true, true, columnNr)
                    } else {
                        getUsers(true, true, false, columnNr)
                    }
                } else {
                    getUsers(true);
                }


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
}
// --------------------------------------------------------------------------------------------------------------------

// NEW USER -----------------------------------------------------------------------------------------------------------
function prepareNewUser() {
    clearTextBox();
    deselectUsers();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#upload_form').hide();
    $('#update_button').hide();
    $('#new_button').hide();
    $('#delete_button').hide();
    $('#add_button').show();
    $('#cancel_button').show();
}

function cancelNewUser() {
    clearTextBox();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#upload_form').show();
    $('#update_button').show();
    $('#new_button').show();
    $('#delete_button').show();
    $('#add_button').hide();
    $('#cancel_button').hide();
}

function newUser() {
    var user_last_name = $("#user_last_name").val();
    argString = "?user_last_name=" + user_last_name;

    var user_name = $("#user_name").val();
    argString = argString + "&user_name=" + user_name;

    var user_sex = $("#user_sex").val();
    argString = argString + "&user_sex=" + user_sex;

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

    var is_pi = $("#user_is_pi").is(':checked');
    if (is_pi == true) {
        user_is_pi = 1;
        argString = argString + "&user_is_pi=" + user_is_pi;
    } else {
        user_is_pi = 0;
        argString = argString + "&user_is_pi=" + user_is_pi;
    }

    var is_phd = $("#user_is_phd").is(':checked');
    if (is_phd == true) {
        user_is_phd = 1;
        argString = argString + "&user_is_phd=" + user_is_phd;
    } else {
        user_is_phd = 0;
        argString = argString + "&user_is_phd=" + user_is_phd;
    }

    var is_financial_team = $("#user_is_financial_team").is(':checked');
    if (is_financial_team == true) {
        argString = argString + "&user_is_financial_team=" + 1;
    } else {
        argString = argString + "&user_is_financial_team=" + 0;
    }

    var is_admin = $("#user_is_admin").is(':checked');
    if (is_admin == true) {
        argString = argString + "&user_is_admin=" + 1;
    } else {
        argString = argString + "&user_is_admin=" + 0;
    }

    var is_lender = $("#user_is_lender").is(':checked');
    if (is_lender == true) {
        argString = argString + "&user_is_lender=" + 1;
    } else {
        argString = argString + "&user_is_lender=" + 0;
    }

    var is_lender_admin = $("#user_is_lender_admin").is(':checked');
    if (is_lender_admin == true) {
        argString = argString + "&user_is_lender_admin=" + 1;
    } else {
        argString = argString + "&user_is_lender_admin=" + 0;
    }

    var is_owner = $("#user_is_owner").is(':checked');
    if (is_owner == true) {
        argString = argString + "&user_is_owner=" + 1;
    } else {
        argString = argString + "&user_is_owner=" + 0;
    }

    $.get("/users/new" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            $('#upload_form').show();
            $('#update_button').show();
            $('#new_button').show();
            $('#delete_button').show();
            $('#add_button').hide();
            $('#cancel_button').hide();

            getUsers();
            clearTextBox();
            showToast('New user has been added.');
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
// --------------------------------------------------------------------------------------------------------------------

// DELETE USER --------------------------------------------------------------------------------------------------------
function deleteUser() {
    if (g_selectedUser == undefined) {
        showToast('Please select a user before clicking delete.');
        return;
    }
    var ID = g_selectedUser.ID;
    argString = "?ID=" + ID;

    $.get("/users/delete" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            showToast('ID:' + ID + ' is deleted.');

            var table_temp = document.querySelector("table");
            const tHead = table_temp.tHead;
            var column = '';
            tHead.querySelectorAll("th").forEach(th => {
                if (th.classList.contains("th-sort-asc") == true || th.classList.contains("th-sort-desc")) {
                    column = th;
                }
            });
            if (column != '') {
                var columnNr = parseInt(getNumbersFromString(column.getAttribute('onclick'))[0]);
                if (column.classList[0] == "th-sort-asc") {
                    clearTextBox();
                    getUsers(false, true, true, columnNr)
                } else {
                    clearTextBox();
                    getUsers(false, true, false, columnNr)
                }
            } else {
                clearTextBox();
                getUsers();
            }
        }
    });
}
// --------------------------------------------------------------------------------------------------------------------

// FLASH/TOAST NOTIFICATIONS-------------------------------------------------------------------------------------------
function showToast(text, color = '#01A38C') {
    var toastHTML = `<div id="toast_pop_up" style="background-color:${color};" class="mlbutton">${text}</div>`;

    $("#toast_message").html(toastHTML);

    setTimeout(function () {
        $('#toast_message').fadeOut(500, function () {
            $(this).empty().show();
        });
    }, 2500);
}

function removeFlashNotification() {
    $(".notification").remove();
}
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
function giveInputWarning(inputID) {
    // console.log('#' + inputID)
    var input = $('#' + inputID);

    input.css("border-color", "#BA604D");
    input.css("transition", "0.2s");

    setTimeout(function () {
        input.css("border-color", "");
    }, 1500);
}
// --------------------------------------------------------------------------------------------------------------------

// UPLOAD FILE TO SELECTED USER ---------------------------------------------------------------------------------------
$(function () {
    $('#submit').click(function () {
        if (g_selectedUser != undefined) {
            if ($('#file_input').val() != '') {
                var form_data = new FormData($('#upload_form')[0]);
                $.ajax({
                    type: 'POST',
                    url: '/users-files/upload?user_id=' + g_selectedUser.ID,
                    data: form_data,
                    contentType: false,
                    processData: false,
                    dataType: 'json'
                }).done(function (data, textStatus, jqXHR) {
                    returnData = JSON.parse(data);
                    if ("error" in returnData && returnData["error"] == "file not allowed") {
                        showToast('Please upload a valid file. (png/jpg/jpeg)');
                    } else {
                        showToast('The profile picture has successfully been uploaded to the selected user.');
                    }
                    $('#file_input').val('')
                }).fail(function (data) {
                    $('#file_input').val('')
                    showToast('Error! Please try uploading again.');
                });
            } else {
                showToast('Please upload a valid file. (png/jpg/jpeg)');
            }
        } else {
            showToast('Please select a user before uploading a file.');
        }
    });
});
// --------------------------------------------------------------------------------------------------------------------