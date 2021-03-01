
var g_user;
var g_selectedUser;
var g_selectedRow = -1;

$(document).ready(function () {
    getUsers();
});

function getUsers(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/getUsers", function (data, status) {
        g_user = JSON.parse(data);
        if (g_user.length > 0) {
            tableHTML = "<table id='blue_table' class='blueTable table-sortable'>"
            tableHTML = tableHTML.concat(generateTableHeader());
            tableHTML = tableHTML.concat("<tbody>");
            $.each(g_user, function (i, item) {
                tableHTML = tableHTML.concat(generateTabelRow(i + 1, item));
            });
            tableHTML = tableHTML.concat("<tbody>");
            tableHTML = tableHTML.concat("</table>");

            $("#usersTable").html(tableHTML);
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

    if (content == null) {
        content = '';
    }

    out = '<div style="overflow:hidden; width:' + width.toString() + 'px;">';
    out = out.concat(content);
    out = out.concat('</div>');
    return out;
}

function selectRowUser(row) {
    if(typeof row == 'number') {
        rowNr = row
    } else {
        rowNr = row.rowIndex;
    }
    var rowNr_data = getJSONFromTable(rowNr);
    
    var table = document.getElementById("usersTable");
    var rows = table.getElementsByTagName("tr");

    if (g_selectedRow > -1 && g_selectedRow < rows.length) {
        var table_temp = document.querySelector("table");
        const tBody = table_temp.tBodies[0];
        const rows_temp = Array.from(tBody.querySelectorAll("tr"));
        rows_temp.forEach(tr => tr.style.backgroundColor = null);
    }
    selectedRow = rows[rowNr];
    selectedRow.style.backgroundColor = '#A7DF62';
    g_selectedRow = rowNr;
    g_selectedUser = g_user[rowNr_data - 1];

    $("#user_last_name").val(g_selectedUser.user_last_name);
    $("#user_name").val(g_selectedUser.user_name);
    if (g_selectedUser.user_sex == "m") {
        $("#user_sex").val("m").change();
    } else if (g_selectedUser.user_sex == "v") {
        $("#user_sex").val("v").change();
    } else {
        $("#user_sex").val("x").change();
    }
    if (g_selectedUser.user_is_pi == 1) {
        $("#user_is_pi").prop("checked", true);
    } else if (g_selectedUser.equipment_is_mobile == -1) {
        $("#user_is_pi").prop("checked", false);
    } else {
        $("#user_is_pi").prop("checked", false);
    }
    if (g_selectedUser.user_is_phd == 1) {
        $("#user_is_phd").prop("checked", true);
    } else if (g_selectedUser.user_is_phd == -1) {
        $("#user_is_phd").prop("checked", false);
    } else {
        $("#user_is_phd").prop("checked", false);
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
            $("#user_in_date").val(inDate[2]+'-'+inDate[1]+'-0'+inDate[0]);
        } else {
            $("#user_in_date").val(inDate[2]+'-'+inDate[1]+'-'+inDate[0]);
        }
    } else {
        $("#user_in_date").val("");
    }

    if (g_selectedUser.user_out_date != "-1") {
        var outDate = g_selectedUser.user_out_date.split("/");
        if (outDate[0].length == 1) {
            $("#user_out_date").val(outDate[2]+'-'+outDate[1]+'-0'+outDate[0]);
        } else {
            $("#user_out_date").val(outDate[2]+'-'+outDate[1]+'-'+outDate[0]);
        }
    } else {
        $("#user_out_date").val("");
    }

    $("#user_pw_hash").val(g_selectedUser.user_pw_hash);
    $("#user_alternative_ID").val(g_selectedUser.user_alternative_ID);
    
}

function showToast(text, color){
    const toastHTML = `<div id="toast_pop_up" style="background-color:${color};" class="mlbutton">${text}</div>`;

    $("#toast_message").html(toastHTML);

    setTimeout(function(){
        $('#toast_message').fadeOut(500, function() {
            $(this).empty().show();
        });
    },1500);
}

function updateUser() {
    if (g_selectedUser == undefined) {
        showToast('Gelieve een gebruiker aan te duiden.', '#B08734');
        return;
    }
    var ID = g_selectedUser.ID;
    argString = "?ID=" + ID;

    var user_last_name = $("#user_last_name").val();
    argString = argString + "&user_last_name=" + user_last_name.toUpperCase();

    var user_name = "";
    var name = $("#user_name").val().split(' ');
    for (i = 0; i<name.length; i++) {
        for (j = 0; j<name[i].length; j++) {
            if (j == 0) {
                user_name = user_name + name[i][j].toUpperCase();
            } else {
                user_name = user_name + name[i][j];
            }
        }
        user_name = user_name + " ";
    }
    argString = argString + "&user_name=" + user_name;

    var user_sex = $("#user_sex").val();
    argString = argString + "&user_sex=" + user_sex;
    
    var is_pi = $("#user_is_pi").is(':checked');
    if (is_pi == true) {
        user_is_pi = 1;
        argString = argString + "&user_is_pi=" + user_is_pi;
    } else {
        if (g_selectedUser.user_is_pi == 1 || g_selectedUser.user_is_pi == 0) {
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
        if (g_selectedUser.user_is_phd == 1 || g_selectedUser.user_is_phd == 0) {
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
        argString = argString + "&user_in_date=" + user_in_date[2]+'/'+user_in_date[1]+'/'+user_in_date[0];
    }

    if ($("#user_out_date").val() == "") {
        argString = argString + "&user_out_date=-1";
    } else {
        var user_out_date = $("#user_out_date").val().split("-");
        argString = argString + "&user_out_date=" + user_out_date[2]+'/'+user_out_date[1]+'/'+user_out_date[0];
    }

    var user_pw_hash = $("#user_pw_hash").val();
    argString = argString + "&user_pw_hash=" + user_pw_hash;

    var user_alternative_ID = $("#user_alternative_ID").val();
    argString = argString + "&user_alternative_ID=" + user_alternative_ID;

    if (g_selectedRow > -1) {
        $.get("/updateUser" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                showToast('User is geupdate', '#5DB034');

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
                    } else{
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
                showToast('Gelieve de velden correct in te vullen', '#B08734');
            }
        });
    }
}

function resetUser(){
    clearTextBox();
    g_selectedUser = undefined;
    g_selectedRow = -1;

    getUsers();
    showToast('Velden gereset', '#349BB0');
}

function clearTextBox() {
    $("#user_last_name").val("");
    $("#user_name").val("");
    $("#user_sex").val("");
    $("#user_is_pi").prop("checked", false);
    $("#user_is_phd").prop("checked", false);
    $("#user_title").val("");
    $("#user_category").val("");
    $("#user_function").val("");
    $("#user_email").val("");
    $("#user_home_address").val("");
    $("#user_telephone").val("")
    $("#user_private_phone").val("")
    $("#user_in_date").val("");
    $("#user_out_date").val("");
    $("#user_pw_hash").val("");
    $("#user_alternative_ID").val("");
}

function newUser() {
    var user_last_name = $("#user_last_name").val();
    argString = "?user_last_name=" + user_last_name.toUpperCase();

    var user_name = "";
    var name = $("#user_name").val().split(' ');
    for (i = 0; i<name.length; i++) {
        for (j = 0; j<name[i].length; j++) {
            if (j == 0) {
                user_name = user_name + name[i][j].toUpperCase();
            } else {
                user_name = user_name + name[i][j];
            }
        }
        user_name = user_name + " ";
    }
    argString = argString + "&user_name=" + user_name;

    var user_sex = $("#user_sex").val();
    argString = argString + "&user_sex=" + user_sex;
    
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
        argString = argString + "&user_in_date=" + user_in_date[2]+'/'+user_in_date[1]+'/'+user_in_date[0];
    }

    if ($("#user_out_date").val() == "") {
        argString = argString + "&user_out_date=-1";
    } else {
        var user_out_date = $("#user_out_date").val().split("-");
        argString = argString + "&user_out_date=" + user_out_date[2]+'/'+user_out_date[1]+'/'+user_out_date[0];
    }

    var user_pw_hash = $("#user_pw_hash").val();
    argString = argString + "&user_pw_hash=" + user_pw_hash;

    var user_alternative_ID = $("#user_alternative_ID").val();
    argString = argString + "&user_alternative_ID=" + user_alternative_ID;

    $.get("/newUser" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            getUsers();
            clearTextBox();
            showToast('Nieuwe user is aangemaakt', '#8734B0');
        } else if (data.localeCompare("http400") == 0) {
            if (user_last_name == "") {
                giveInputWarning("user_last_name");
            }
            if (user_name == "") {
                giveInputWarning("user_name");
            }
            showToast('Gelieve de velden correct in te vullen', '#B08734');
        }
    });
}

function deleteUser() {
    if (g_selectedUser == undefined) {
        showToast('Gelieve een gebruiker aan te duiden.', '#B08734');
        return;
    }
    var ID = g_selectedUser.ID;
    argString = "?ID=" + ID;

    $.get("/deleteUser" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            showToast('ID:' + ID + ' is verwijderd', '#B04934');

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
                    getUsers(false, true, true, columnNr);
                    clearTextBox();
                } else{
                    getUsers(false, true, false, columnNr);
                    clearTextBox();
                }
            } else {
                getUsers();
                clearTextBox();
            }
        }
    });
}

// https://www.youtube.com/watch?v=8SL_hM1a0yo
function sortTableByColumn(table, column, asc = true) {
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
            const aColText = a.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
        } else {
            const aColText = a.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            const bColText = b.querySelector(`td:nth-child(${column+1})`).textContent.trim();
            return parseFloat(aColText) > parseFloat(bColText) ? (1 * dirModifier) : (-1 * dirModifier);
        }
    });
    for (i = 0; i<sortedRows.length; i++) {
        var innerText = sortedRows[i].innerText.split("\n\t\n");
        var nameArray = innerText[1].split(" ");
        var lastName = "";
        for (j = 0; j<nameArray.length; j++) {
            if (nameArray[j] == nameArray[j].toUpperCase()) {
                lastName = lastName + nameArray[j]+ " ";
            }
        }
        lastName = lastName.slice(0, -1);
        if (g_selectedUser != undefined) {
            if (lastName == g_selectedUser.user_last_name) {
                g_selectedRow = i+1;
            }
        }
    }
    
    // remove all resisting tr from table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // add sorted rows
    tBody.append(...sortedRows);

    // remember current sorting type (asc or decs)
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column+1})`).classList.toggle("th-sort-desc", !asc);
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

function getJSONFromTable(rowNr) {
    var table = document.getElementById('blue_table').tBodies[0];
    var jsonArr = [];
    for(var i =0,row;row = table.rows[i];i++){
         var col = row.cells;
         var jsonObj = {
             elem : col[0].innerHTML
           }
  
        jsonArr.push(jsonObj);
    }

    var ID = getNumbersFromString(jsonArr[rowNr-1].elem)[1];// creates array from matches
    return ID;
}

function getNumbersFromString(string) {    
    var regex = /\d+/g;
    var matches = string.match(regex);
    return matches;
}

function giveInputWarning(inputID){
    console.log('#'+inputID)
    var input = $('#'+inputID);

    input.css("border-color", "#BA604D");
    input.css("background-color","#E1BBB3");
    input.css("transition","0.2s");

    setTimeout(function(){
        input.css("border-color", "");
        input.css("background-color", "");
    },1500);
}