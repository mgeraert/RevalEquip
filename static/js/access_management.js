var g_notAllowedUsers;

var g_imageDirectory = "static\\images\\";
var g_documentDirectory = "static\\docs\\";

$(document).ready(function () {
    $("#menu_title").text("Access management");
    getListOfNotAllowedUsers();
});

function getListOfNotAllowedUsers() {
    $.get("/users/get-by-access?access=0", function (data, status) {
        g_notAllowedUsers = JSON.parse(data);
        tableHTML = "<table id='blue_table' class='table_design table-sortable'>"
        tableHTML = tableHTML.concat(generateTableHeader());
        tableHTML = tableHTML.concat("<tbody id='blue_tbody'>");
        tableHTML = tableHTML.concat("</tbody>");
        tableHTML = tableHTML.concat("</table>");
        $("#not_allowed_users_table").html(tableHTML);

        tableHTML = "";
        $.each(g_notAllowedUsers, function (i, item) {
            tableHTML = tableHTML.concat(generateTabelRow(i, item));
        });
        $("#blue_tbody").append(tableHTML);

        generateFileIcons();
    });
}

function generateTableHeader() {
    out = "";
    out = "<thead><tr>";

    out = out.concat("<th>");
    out = out.concat("Name");
    out = out.concat("</th>");

    out = out.concat("<th>");
    out = out.concat('Email');
    out = out.concat("</th>");

    out = out.concat("<th>");
    out = out.concat('Files');
    out = out.concat("</th>");

    out = out.concat("<th>");
    out = out.concat('Access');
    out = out.concat("</th>");

    out = out.concat("</tr></thead>");

    return out;
}

function generateTabelRow(rownNr, user) {
    out = "";

    out = "<tr>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_email));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat('<div id="file_icon' + rownNr + '" class="file_icon">');
    out = out.concat("</div>");
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat('<button id="allow_button" onclick="allowUser(' + rownNr + ')" class="mlbutton">Allow</button><button id="deny_button" onclick="denyUser(' + rownNr + ')" class="mlbutton">Deny</button>');
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function getTableDiv(content) {
    out = "";

    if (content == null) {
        content = '';
    }

    out = '<div style="overflow:hidden;">';
    out = out.concat(content);
    out = out.concat('</div>');
    return out;
}

function generateFileIcons() {
    $.each(g_notAllowedUsers, function (i, item) {
        generateFileIcon(i, item);
    });
}

function generateFileIcon(row, user) {
    var user_id = user.ID;
    $.get("/access-files/get-by-user-id?user_id=" + user_id, function (data, status) {
        out = "";
        var file = JSON.parse(data)[0];
        console.log(file);
        if (file == undefined) {
            return out;
        }
        if ("document_name" in file) {
            var document_name = file.document_name;
            var icon = 'doc.svg';
            out = out.concat('<a href="/access-files/user-document?document=' + document_name + '">');
            out = out.concat('<img title="' + document_name + '" src=' + g_imageDirectory + 'icons\\' + icon + '>');
            out = out.concat('</a>');
        } else {
            var picture_name = file.picture_name;
            var icon = 'img.svg';
            out = out.concat('<img title="' + picture_name + '" src=' + g_imageDirectory + 'icons\\' + icon + ' onclick="openAddedPictureOfUser(' + user_id + ')">');
        }

        $("#file_icon" + row).html(out);
        return out;
    });
}

function allowUser(row) {
    var selectedUser = g_notAllowedUsers[row];
    $.get("/access-management/allow?user_id=" + selectedUser.ID + "&user_email=" + selectedUser.user_email, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            getListOfNotAllowedUsers();
        }
    });
}

function denyUser(row) {
    var selectedUser = g_notAllowedUsers[row];
    $.get("/access-management/deny?user_id=" + selectedUser.ID, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            getListOfNotAllowedUsers();
        }
    });
}

function openAddedPictureOfUser(user_id) {
    $.get("/access-files/get-by-user-id?user_id=" + user_id, function (data, status) {
        var picture = JSON.parse(data)[0];
        var picture_name = picture.picture_name;
        var picturePopUpHTML = '';
        $("#picture_pop_up").html(picturePopUpHTML);
        picturePopUpHTML = picturePopUpHTML.concat('<span class="close cursor" onclick="closePicturePopUp()">×</span>');
        picturePopUpHTML = picturePopUpHTML.concat('<div class="picture_pop_up-content">');
        picturePopUpHTML = picturePopUpHTML.concat('<div class="picture_pop_up-picture" style="display: block;"><img title="' + picture_name + '" src="' + g_imageDirectory + 'upload\\' + picture_name + '"></div>');
        picturePopUpHTML = picturePopUpHTML.concat('</div>');
        console.log(picturePopUpHTML)
        $("#picture_pop_up").html(picturePopUpHTML);
        openPicturePopUp();
    });
}

function openPicturePopUp() {
    document.getElementById("picture_pop_up").style.display = "block";
}

function closePicturePopUp() {
    document.getElementById("picture_pop_up").style.display = "none";
}