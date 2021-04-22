var g_suppliers;
var g_selectedSupplier;
var g_selectedRow = -1;

var g_currentUser;

$(document).ready(function () {
    $("#menu_title").text("Suppliers");

    $.get("/users/get-permissions-by-id?" + $("#current_user_id").text(), function (data, status) {
        g_currentUser = JSON.parse(data)[0];
        if (g_currentUser.user_is_admin) {
            $('#new_button').show();
            $('#delete_button').show();
            $('#export_button').show();
        }
        else {
            $('#new_button').hide();
            $('#delete_button').hide();
            $('#export_button').hide();
        }
        getSuppliers();
    });
});

// GENERATE SUPPLIERS TABLE -----------------------------------------------------------------------------------------------
function getSuppliers(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/suppliers/get", function (data, status) {
        g_suppliers = JSON.parse(data);
        if (g_suppliers.length > 0) {
            tableHTML = "<table id='blue_table' class='table_design table-sortable'>"
            tableHTML = tableHTML.concat(generateTableHeader());
            tableHTML = tableHTML.concat("<tbody>");
            $.each(g_suppliers, function (i, item) {
                tableHTML = tableHTML.concat(generateTabelRow(i + 1, item));
            });
            tableHTML = tableHTML.concat("<tbody>");
            tableHTML = tableHTML.concat("</table>");

            $("#suppliers_table").html(tableHTML);
            // addRowHandlers();
            if (enableSort) {
                sortTableByColumn(document.querySelector("table"), sortColumn, sortAsc);
            }
            if (enableSelectedRow) {
                selectRowSupplier(g_selectedRow);
            }
        }
    });
}

function generateTableHeader() {
    out = "<thead><tr>";

    out = out.concat("<th onclick='sortColumnSupplier(0)'>");
    out = out.concat("#");
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnSupplier(1)'>");
    out = out.concat('Name');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnSupplier(2)'>");
    out = out.concat('Company');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnSupplier(3)'>");
    out = out.concat('Email');
    out = out.concat("</th>");

    out = out.concat("</tr></thead>");

    return out;
}


function generateTabelRow(rowNr, supplier) {

    out = "<tr onclick='selectRowSupplier(this)'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(rowNr.toString(), 32, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(supplier.supplier_last_name + ' ' + supplier.supplier_name, 300, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(supplier.supplier_company, 100, rowNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(supplier.supplier_email, 300, rowNr));
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
// --------------------------------------------------------------------------------------------------------------------

// DO .... WHEN SUPPLIER GETS SELECTED --------------------------------------------------------------------------------
function selectRowSupplier(row) {
    clearTextBox();
    loadSelectedData(row);
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

    var table = document.getElementById("suppliers_table");
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
    g_selectedSupplier = g_suppliers[rowNr_data - 1];

    $("#supplier_last_name").val(g_selectedSupplier.supplier_last_name);
    $("#supplier_name").val(g_selectedSupplier.supplier_name);
    $("#supplier_email").val(g_selectedSupplier.supplier_email);
    $("#supplier_phone").val(g_selectedSupplier.supplier_phone);
    $("#supplier_company").val(g_selectedSupplier.supplier_company);
    $("#supplier_comment").val(g_selectedSupplier.supplier_comment);
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

// --------------------------------------------------------------------------------------------------------------------
function clearTextBox() {
    $("#supplier_last_name").val("");
    $("#supplier_name").val("");
    $("#supplier_email").val("");
    $("#supplier_phone").val("");
    $("#supplier_company").val("");
    $("#supplier_comment").val("");
}

function deselectSupplier() {
    g_selectedSupplier = undefined;
    g_selectedRow = -1;
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

// UPDATE SELECTED SUPPLIER -------------------------------------------------------------------------------------------
function updateSupplier() {
    if (g_selectedSupplier == undefined) {
        showToast('Gelieve een supplier aan te duiden.', '#B08734');
        return;
    }
    var ID = g_selectedSupplier.ID;
    argString = "?ID=" + ID;

    var supplier_last_name = $("#supplier_last_name").val();
    argString = argString + "&supplier_last_name=" + supplier_last_name.toUpperCase();

    var supplier_name = "";
    if ($("#supplier_name").val() != "") {
        var name = $("#supplier_name").val().split(' ');
        for (i = 0; i < name.length; i++) {
            for (j = 0; j < name[i].length; j++) {
                if (j == 0) {
                    supplier_name = supplier_name + name[i][j].toUpperCase();
                } else {
                    supplier_name = supplier_name + name[i][j];
                }
            }
            supplier_name = supplier_name + " ";
        }
        supplier_name = supplier_name.slice(0, -1);
    }
    argString = argString + "&supplier_name=" + supplier_name;

    var supplier_email = $("#supplier_email").val();
    argString = argString + "&supplier_email=" + supplier_email;

    var supplier_phone = $("#supplier_phone").val();
    argString = argString + "&supplier_phone=" + supplier_phone;

    var supplier_company = $("#supplier_company").val();
    argString = argString + "&supplier_company=" + supplier_company;

    var supplier_comment = $("#supplier_comment").val();
    argString = argString + "&supplier_comment=" + supplier_comment;

    if (g_selectedRow > -1) {
        $.get("/suppliers/update" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                showToast("Selected supplier has been updated.");

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
                        getSuppliers(true, true, true, columnNr)
                    } else {
                        getSuppliers(true, true, false, columnNr)
                    }
                } else {
                    getSuppliers(true);
                }
            } else if (data.localeCompare("http400") == 0) {
                if (supplier_last_name == "") {
                    giveInputWarning("supplier_last_name");
                }
                if (supplier_name == "") {
                    giveInputWarning("supplier_name");
                }
                if (supplier_email == "") {
                    giveInputWarning("supplier_email");
                }
                if (supplier_phone == "") {
                    giveInputWarning("supplier_phone");
                }
            }
        });
    }
}
// --------------------------------------------------------------------------------------------------------------------

// NEW SUPPLIER -------------------------------------------------------------------------------------------------------
function prepareNewSupplier() {
    clearTextBox();
    deselectSupplier();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#update_button').hide();
    $('#new_button').hide();
    $('#delete_button').hide();
    $('#add_button').show();
    $('#cancel_button').show();
}

function cancelNewSupplier() {
    clearTextBox();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#update_button').show();
    $('#new_button').show();
    $('#delete_button').show();
    $('#add_button').hide();
    $('#cancel_button').hide();
}

function newSupplier() {
    var supplier_last_name = $("#supplier_last_name").val();
    argString = "?supplier_last_name=" + supplier_last_name;

    var supplier_name = $("#supplier_name").val();
    argString = argString + "&supplier_name=" + supplier_name;

    var supplier_email = $("#supplier_email").val();
    argString = argString + "&supplier_email=" + supplier_email;

    var supplier_phone = $("#supplier_phone").val();
    argString = argString + "&supplier_phone=" + supplier_phone;

    var supplier_company = $("#supplier_company").val();
    argString = argString + "&supplier_company=" + supplier_company;

    var supplier_comment = $("#supplier_comment").val();
    argString = argString + "&supplier_comment=" + supplier_comment;

    $.get("/suppliers/new" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            getSuppliers();
            clearTextBox();

            $('#update_button').show();
            $('#new_button').show();
            $('#delete_button').show();
            $('#add_button').hide();
            $('#cancel_button').hide();

            showToast('New supplier has been added.');
        } else if (data.localeCompare("http400") == 0) {
            if (supplier_last_name == "") {
                giveInputWarning("supplier_last_name");
            }
            if (supplier_name == "") {
                giveInputWarning("supplier_name");
            }
            if (supplier_email == "") {
                giveInputWarning("supplier_email");
            }
            if (supplier_phone == "") {
                giveInputWarning("supplier_phone");
            }
        }
    });
}
// --------------------------------------------------------------------------------------------------------------------

// DELETE SUPPLIER ----------------------------------------------------------------------------------------------------
function deleteSupplier() {
    if (g_selectedSupplier == undefined) {
        showToast('Please select a supplier before clicking delete.');
        return;
    }
    var ID = g_selectedSupplier.ID;
    argString = "?ID=" + ID;

    $.get("/suppliers/delete" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            showToast('ID:' + ID + ' is deleted');

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
                    getSuppliers(false, true, true, columnNr);
                    clearTextBox();
                } else {
                    getSuppliers(false, true, false, columnNr);
                    clearTextBox();
                }
            } else {
                getSuppliers();
                clearTextBox();
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