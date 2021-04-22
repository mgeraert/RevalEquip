var g_equipment;
var g_selectedEquipment;
var g_selectedRow = -1;

var g_currentUser;

var g_owner;
var g_selectedOwner;
var g_coOwner;
var g_selectedCoOwner;
var g_supplier;
var g_selectedSupplier;

var g_imageDirectory = "static\\images\\";

$(document).ready(function () {
    $("#menu_title").text("Equipment");

    $.get("/users/get-permissions-by-id?" + $("#current_user_id").text(), function (data, status) {
        g_currentUser = JSON.parse(data)[0];
        if (g_currentUser.user_is_lender) {
            showButtons(false);
            showAllInputs(false);
            setReadOnly(true);
        }
        if (g_currentUser.user_can_see_financial_data) {
            showButtons(true);
            showAllInputs(true);
            setReadOnly(false);
        }
        if (g_currentUser.user_is_admin) {
            showButtons(true);
            showAllInputs(true);
            setReadOnly(false);
        }
        getEquipment();
    });
});

function setReadOnly(boolean) {
    if (boolean) {
        $('#wide_panel input').attr('readonly', true);
        $('#wide_panel input:checkbox').attr('disabled', true);
    } else {
        $('#wide_panel input').attr('readonly', false);
        $('#wide_panel input:checkbox').attr('disabled', false);
    }
}

function showAllInputs(boolean) {
    if (boolean) {
        $('#eq_purchase_price_label').show();
        $('#eq_annual_cost_label').show();
        $('#eq_annual_cost_budget_label').show();
    } else {
        $('#eq_purchase_price_label').hide();
        $('#eq_annual_cost_label').hide();
        $('#eq_annual_cost_budget_label').hide();
    }
}

function showButtons(boolean) {
    if (boolean) {
        $('#update_button').show();
        $('#new_button').show();
        $('#delete_button').show();
        $('#export_button').show();
    } else {
        $('#update_button').hide();
        $('#new_button').hide();
        $('#delete_button').hide();
        $('#export_button').hide();
    }
}

// GENERATE EQUIPMENT TABLE -----------------------------------------------------------------------------------------------
function getEquipment(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/equipment/get", function (data, status) {
        g_equipment = JSON.parse(data);
        if (g_equipment.length > 0) {
            tableHTML = "<table id='blue_table' class='table_design table-sortable'>"
            tableHTML = tableHTML.concat(generateTableHeader());
            tableHTML = tableHTML.concat("<tbody>");
            $.each(g_equipment, function (i, item) {
                tableHTML = tableHTML.concat(generateTabelRow(i + 1, item));
            });
            tableHTML = tableHTML.concat("<tbody>");
            tableHTML = tableHTML.concat("</table>");

            $("#equipment_table").html(tableHTML);
            // addRowHandlers();
            if (enableSort) {
                sortTableByColumn(document.querySelector("table"), sortColumn, sortAsc);
            }
            if (enableSelectedRow) {
                selectRowEquipment(g_selectedRow);
            }
        }
    });
}

function generateTableHeader() {
    out = "";
    out = "<thead><tr>";

    out = out.concat("<th onclick='sortColumnEquipment(0)'>");
    out = out.concat("#");
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnEquipment(1)'>");
    out = out.concat('Name');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnEquipment(2)'>");
    out = out.concat('Description');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnEquipment(3)'>");
    out = out.concat('Outcome');
    out = out.concat("</th>");

    out = out.concat("</tr></thead>");

    return out;
}

function generateTabelRow(rownNr, equipment) {
    out = "";

    out = "<tr onclick='selectRowEquipment(this)'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(rownNr.toString(), 50, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_name, 400, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_description, 300, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_outcome, 300, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function getTableDiv(content, width, rownNr) {
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


// DO .... WHEN EQUIPMENT GETS SELECTED -------------------------------------------------------------------------------------
function selectRowEquipment(row) {
    clearTextBox();
    loadSelectedData(row);
    generateGallery();
    generateDocuments();
    checkIfUserIsOwner();
}
// --------------------------------------------------------------------------------------------------------------------

// LOAD INPUT VALUES --------------------------------------------------------------------------------------------
function loadSelectedData(row) {
    if (typeof row == 'number') {
        rowNr = row
    } else {
        rowNr = row.rowIndex;
    }

    var rowNr_data = getJSONFromTable(rowNr);

    var table = document.getElementById("equipment_table");
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
    g_selectedEquipment = g_equipment[rowNr_data - 1];

    $("#eq_inventory_number").val(g_selectedEquipment.equipment_inventory_number);
    $("#eq_label").val(g_selectedEquipment.equipment_label);
    $("#eq_name").val(g_selectedEquipment.equipment_name);
    $("#eq_amount").val(g_selectedEquipment.equipment_amount);
    $("#eq_desc").val(g_selectedEquipment.equipment_description);
    $("#eq_outcome").val(g_selectedEquipment.equipment_outcome);
    $("#eq_purchase_date").val(g_selectedEquipment.equipment_purchase_date);
    $("#eq_base_location").val(g_selectedEquipment.equipment_base_location);
    if (g_selectedEquipment.equipment_is_mobile == 1) {
        $("#eq_is_mobile").prop("checked", true);
    } else {
        $("#eq_is_mobile").prop("checked", false);
    }
    if (g_selectedEquipment.equipment_bookable == 1) {
        $("#eq_bookable").prop("checked", true);
    } else {
        $("#eq_bookable").prop("checked", false);
    }

    var owner_id = g_selectedEquipment.equipment_owner_id;
    if (owner_id != -1) {
        $.get("/users/get-name-by-id?ID=" + owner_id, function (data, status) {
            var owner = JSON.parse(data)[0];
            $("#eq_owner_id").val(owner.user_last_name + ' ' + owner.user_name);
            $('#eq_owner_detail').css("visibility", "visible");
        });
        generateInformationPopUp('owner', owner_id);
    } else {
        $('#eq_owner_detail').css("visibility", "hidden");
        $("#owner_info_pop_up").html('');
    }

    var co_owner_id = g_selectedEquipment.equipment_co_owner_id;
    if (co_owner_id != -1) {
        $.get("/users/get-name-by-id?ID=" + co_owner_id, function (data, status) {
            var coOwner = JSON.parse(data)[0];
            $("#eq_co_owner_id").val(coOwner.user_last_name + ' ' + coOwner.user_name);
            $('#eq_co_owner_detail').css("visibility", "visible");
        });
        generateInformationPopUp('co_owner', co_owner_id);
    } else {
        $('#eq_co_owner_detail').css("visibility", "hidden");
        $("#co_owner_info_pop_up").html('');
    }

    var supplier_id = g_selectedEquipment.equipment_supplier_id;
    if (supplier_id != -1) {
        $.get("/suppliers/get-name-by-id?ID=" + supplier_id, function (data, status) {
            var supplier = JSON.parse(data)[0];
            $("#eq_supplier_id").val(supplier.supplier_last_name + ' ' + supplier.supplier_name);
            $('#eq_supplier_detail').css("visibility", "visible");
        });
        generateInformationPopUp('supplier', supplier_id);
    } else {
        $('#eq_supplier_detail').css("visibility", "hidden");
        $("#supplier_info_pop_up").html('');
    }

    $("#eq_purchase_price").val(g_selectedEquipment.equipment_purchase_price);
    $("#eq_annual_cost").val(g_selectedEquipment.equipment_annual_cost);
    $("#eq_annual_cost_budget").val(g_selectedEquipment.equipment_annual_cost_budget);
}
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
function checkIfUserIsOwner() {
    if (g_currentUser.user_is_admin == 0) {
        if (g_selectedEquipment.equipment_owner_id == g_currentUser.ID || g_selectedEquipment.equipment_co_owner_id == g_currentUser.ID) {
            $.get("/equipment/get-by-id?equipment_id=" + g_selectedEquipment.ID, function (data, status) {
                var equipment = JSON.parse(data)[0];

                $("#eq_purchase_price").val(equipment.equipment_purchase_price);
                $("#eq_annual_cost").val(equipment.equipment_annual_cost);
                $("#eq_annual_cost_budget").val(equipment.equipment_annual_cost_budget);

                showButtons(true);
                showAllInputs(true);
                setReadOnly(false);
            });
        } else {
            showButtons(false);
            showAllInputs(false);
            setReadOnly(true);
        }
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
        if (g_selectedEquipment != undefined) {
            if (name == g_selectedEquipment.equipment_name) {
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

function sortColumnEquipment(column) {
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

// UPDATE SELECTED EQUIPMENT ------------------------------------------------------------------------------------------
function updateEquip() {
    // g_selectedEquipment = g_equipment[rownNr - 1];
    if (g_selectedEquipment == undefined) {
        showToast("Please select an equipment.");
        return;
    }
    var ID = g_selectedEquipment.ID;
    argString = "?ID=" + ID;

    var equipment_inventory_number = $("#eq_inventory_number").val();
    argString = argString + "&equipment_inventory_number=" + equipment_inventory_number;

    var equipment_label = $("#eq_label").val();
    argString = argString + "&equipment_label=" + equipment_label;

    var equipment_name = $("#eq_name").val();
    argString = argString + "&equipment_name=" + equipment_name;

    var equipment_amount = $("#eq_amount").val();
    argString = argString + "&equipment_amount=" + equipment_amount;

    var equipment_description = $("#eq_desc").val();
    argString = argString + "&equipment_description=" + equipment_description;

    var equipment_outcome = $("#eq_outcome").val();
    argString = argString + "&equipment_outcome=" + equipment_outcome;

    var equipment_purchase_date = $("#eq_purchase_date").val();
    argString = argString + "&equipment_purchase_date=" + equipment_purchase_date;

    var equipment_base_location = $("#eq_base_location").val();
    argString = argString + "&equipment_base_location=" + equipment_base_location;

    var is_mobile = $("#eq_is_mobile").is(':checked');
    if (is_mobile == true) {
        equipment_is_mobile = 1;
        argString = argString + "&equipment_is_mobile=" + equipment_is_mobile;
    } else {
        if (g_selectedEquipment.equipment_is_mobile == 1 || g_selectedEquipment.equipment_is_mobile == 0) {
            equipment_is_mobile = 0;
        } else {
            equipment_is_mobile = "";
        }
        argString = argString + "&equipment_is_mobile=" + equipment_is_mobile;
    }

    var bookable = $("#eq_bookable").is(':checked');
    if (bookable == true) {
        equipment_bookable = 1;
        argString = argString + "&equipment_bookable=" + equipment_bookable;
    } else {
        if (g_selectedEquipment.equipment_bookable == 1 || g_selectedEquipment.equipment_bookable == 0) {
            equipment_bookable = 0;
        } else {
            equipment_bookable = "";
        }
        argString = argString + "&equipment_bookable=" + equipment_bookable;
    }

    if ($('#eq_purchase_price').length) {
        var equipment_purchase_price = $("#eq_purchase_price").val();
        argString = argString + "&equipment_purchase_price=" + equipment_purchase_price;
    } else {
        argString = argString + "&equipment_purchase_price=";
    }

    if ($('#eq_annual_cost').length) {
        var equipment_annual_cost = $("#eq_annual_cost").val();
        argString = argString + "&equipment_annual_cost=" + equipment_annual_cost;
    } else {
        argString = argString + "&equipment_annual_cost=";
    }

    if ($('#eq_annual_cost_budget').length) {
        var equipment_annual_cost_budget = $("#eq_annual_cost_budget").val();
        argString = argString + "&equipment_annual_cost_budget=" + equipment_annual_cost_budget;
    } else {
        argString = argString + "&equipment_annual_cost_budget=";
    }

    var equipment_owner_id = -1;
    if ($("#eq_owner_id").val() != "") {
        if (g_selectedOwner != undefined) {
            equipment_owner_id = g_selectedOwner.ID;
        } else {
            equipment_owner_id = g_selectedEquipment.equipment_owner_id;
        }
    }
    argString = argString + "&equipment_owner_id=" + equipment_owner_id;

    var equipment_co_owner_id = -1;
    if ($("#eq_co_owner_id").val() != "") {
        if (g_selectedCoOwner != undefined) {
            equipment_co_owner_id = g_selectedCoOwner.ID;
        } else {
            equipment_co_owner_id = g_selectedEquipment.equipment_co_owner_id;
        }
    }
    argString = argString + "&equipment_co_owner_id=" + equipment_co_owner_id;

    var equipment_supplier_id = -1;
    if ($("#eq_supplier_id").val() != "") {
        if (g_selectedSupplier != undefined) {
            equipment_supplier_id = g_selectedSupplier.ID;
        } else {
            equipment_supplier_id = g_selectedEquipment.equipment_supplier_id;
        }
    }
    argString = argString + "&equipment_supplier_id=" + equipment_supplier_id;

    if (g_selectedRow > -1) {
        $.get("/equipment/update" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                showToast("Selected equipment has been updated.");

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
                        getEquipment(true, true, true, columnNr)
                    } else {
                        getEquipment(true, true, false, columnNr)
                    }
                } else {
                    getEquipment(true);
                }
            } else if (data.localeCompare("http400") == 0) {
                showToast("Please fill in all the required values.");
                giveInputWarning("eq_name");
            } else if (data.localeCompare("http403") == 0) {
                showToast("Not allowed.");
            }
        });
    }
}
// --------------------------------------------------------------------------------------------------------------------

// NEW EQUIPMENT ------------------------------------------------------------------------------------------------------
function prepareNewEquip() {
    clearTextBox();
    deselectEquipment();

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

    $('#eq_bookable_label').hide();
}

function cancelNewEquip() {
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

    $('#eq_bookable_label').show();
}

function newEquip() {
    var equipment_inventory_number = $("#eq_inventory_number").val();
    argString = "?equipment_inventory_number=" + equipment_inventory_number;

    var equipment_label = $("#eq_label").val();
    argString = argString + "&equipment_label=" + equipment_label;

    var equipment_name = $("#eq_name").val();
    argString = argString + "&equipment_name=" + equipment_name;

    var equipment_amount = $("#eq_amount").val();
    argString = argString + "&equipment_amount=" + equipment_amount;

    var equipment_description = $("#eq_desc").val();
    argString = argString + "&equipment_description=" + equipment_description;

    var equipment_outcome = $("#eq_outcome").val();
    argString = argString + "&equipment_outcome=" + equipment_outcome;

    var equipment_purchase_date = $("#eq_purchase_date").val();
    argString = argString + "&equipment_purchase_date=" + equipment_purchase_date;

    var equipment_base_location = $("#eq_base_location").val();
    argString = argString + "&equipment_base_location=" + equipment_base_location;

    var is_mobile = $("#eq_is_mobile").is(':checked');
    if (is_mobile == true) {
        equipment_is_mobile = 1;
        argString = argString + "&equipment_is_mobile=" + equipment_is_mobile;
    } else {
        equipment_is_mobile = 0;
        argString = argString + "&equipment_is_mobile=" + equipment_is_mobile;
    }

    // var bookable = $("#eq_bookable").is(':checked');
    // if (bookable == true) {
    //     equipment_bookable = 1;
    //     argString = argString + "&equipment_bookable=" + equipment_bookable;
    // } else {
    //     equipment_bookable = 0;
    //     argString = argString + "&equipment_bookable=" + equipment_bookable;
    // }

    var equipment_owner_id = "";
    if ($("#eq_owner_id").val() != "" && g_selectedOwner != undefined) {
        equipment_owner_id = g_selectedOwner.ID;
    }
    argString = argString + "&equipment_owner_id=" + equipment_owner_id;

    var equipment_co_owner_id = "";
    if ($("#eq_co_owner_id").val() != "" && g_selectedCoOwner != undefined) {
        equipment_co_owner_id = g_selectedCoOwner.ID;
    }
    argString = argString + "&equipment_co_owner_id=" + equipment_co_owner_id;

    var equipment_purchase_price = $("#eq_purchase_price").val();
    argString = argString + "&equipment_purchase_price=" + equipment_purchase_price;

    var equipment_annual_cost = $("#eq_annual_cost").val();
    argString = argString + "&equipment_annual_cost=" + equipment_annual_cost;

    var equipment_annual_cost_budget = $("#eq_annual_cost_budget").val();
    argString = argString + "&equipment_annual_cost_budget=" + equipment_annual_cost_budget;

    var equipment_supplier_id = "";
    if ($("#eq_co_owner_id").val() != "" && g_selectedSupplier != undefined) {
        equipment_supplier_id = g_selectedSupplier.ID;
    }
    argString = argString + "&equipment_supplier_id=" + equipment_supplier_id;

    $.get("/equipment/new" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            $('#upload_form').show();
            $('#update_button').show();
            $('#new_button').show();
            $('#delete_button').show();
            $('#add_button').hide();
            $('#cancel_button').hide();

            $('#eq_bookable_label').show();

            getEquipment();
            clearTextBox();
            showToast('New equipment has been added.');
        } else if (data.localeCompare("http400") == 0) {
            giveInputWarning("eq_name");

            $("#suggestions_owner").empty();
            $("#suggestions_co_owner").empty();
            $("#suggestions_supplier").empty();
        }
    });
}
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
function clearTextBox() {
    $("#eq_inventory_number").val("");
    $("#eq_label").val("");
    $("#eq_name").val("");
    $("#eq_amount").val("");
    $("#eq_desc").val("");
    $("#eq_outcome").val("");
    $("#eq_purchase_date").val("");
    $("#eq_purchase_price").val("");
    $("#eq_annual_cost").val("");
    $("#eq_annual_cost_budget").val("");
    $("#eq_base_location").val("");
    $("#eq_is_mobile").prop("checked", false);
    $("#eq_bookable").prop("checked", false);
    $("#eq_owner_id").val("")
    $("#eq_co_owner_id").val("")
    $("#eq_supplier_id").val("")

    $('#gallery_button').hide();
    $("#gallery_modal").html("");
    $('#documents_button').hide();
    $("#documents_pop_up").html("");

    $("#suggestions_owner").html("");
    $("#suggestions_co_owner").html("");
    $("#suggestions_supplier").html("");
}

function deselectEquipment() {
    g_selectedEquipment = undefined;
    g_selectedRow = -1;
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


// DELETE EQUIPMENT ---------------------------------------------------------------------------------------------------
function deleteEquip() {
    if (g_selectedEquipment == undefined) {
        showToast('Please select an equipment before clicking delete.');
        return;
    }
    var ID = g_selectedEquipment.ID;
    argString = "?ID=" + ID;

    $.get("/equipment/delete" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            showToast('ID:' + ID + ' is verwijderd');

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
                    getEquipment(false, true, true, columnNr)
                } else {
                    clearTextBox();
                    getEquipment(false, true, false, columnNr)
                }
            } else {
                clearTextBox();
                getEquipment();
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

// UPLOAD FILE TO SELECTED EQUIPMENT ----------------------------------------------------------------------------------
$(function () {
    $('#submit').click(function () {
        if (g_selectedEquipment != undefined) {
            if ($('#file_input').val() != '') {
                var form_data = new FormData($('#upload_form')[0]);
                $.ajax({
                    type: 'POST',
                    url: '/equipment-files/upload?equipment_id=' + g_selectedEquipment.ID,
                    data: form_data,
                    contentType: false,
                    processData: false,
                    dataType: 'json'
                }).done(function (data, textStatus, jqXHR) {
                    $('#file_input').val('')
                    showToast('The files has successfully been uploaded to the selected equipment.');
                }).fail(function (data) {
                    $('#file_input').val('')
                    showToast('Error! Please try uploading again.');
                });
            } else {
                showToast('Please upload a valid file.');
            }
        } else {
            showToast('Please select an equipment before uploading a file.');
        }
    });
});
// --------------------------------------------------------------------------------------------------------------------

// GALLERY / PICTURES FOR SELECTED EQUIPMENT --------------------------------------------------------------------------
function generateGallery() {
    $.get("/equipment-files/get-pictures-by-equipment-id?equipment_id=" + g_selectedEquipment.ID, function (data) {
        var pictures = JSON.parse(data);
        var images = [];

        var i = 0;
        pictures.forEach(picture => {
            i++;
            picture_name = picture.picture_name;
            images.push(picture_name);
        });

        if (images.length == 0) {
            $('#gallery_button').hide();
        } else {
            $('#gallery_button').show();

            $("#gallery_modal").html("");
            var modalHTML = '<span class="close cursor" onclick="closeGallery()">&times;</span>';
            modalHTML = modalHTML.concat('<div class="gallery_modal-content">');
            var j = 0;
            images.forEach(image => {
                j++;
                modalHTML = modalHTML.concat('<div class="gallery_slides">');
                modalHTML = modalHTML.concat('<div class="numbertext">' + j + '/' + i + '</div>');
                modalHTML = modalHTML.concat('<img src=' + g_imageDirectory + 'upload\\' + image + ' >');
                modalHTML = modalHTML.concat('</div>');
            });
            modalHTML = modalHTML.concat('<a class="prev" onclick="plusSlides(-1)">&#10094;</a>');
            modalHTML = modalHTML.concat('<a class="next" onclick="plusSlides(1)">&#10095;</a>');
            modalHTML = modalHTML.concat('<div class="caption-container"><p id="caption"></p></div>');
            i = 0;
            modalHTML = modalHTML.concat('<div class="gallery_row">');
            images.forEach(image => {
                i++;
                modalHTML = modalHTML.concat('<div class="img-w">');
                modalHTML = modalHTML.concat('<img class="demo cursor" src=' + g_imageDirectory + 'upload\\' + image + ' onclick="currentSlide(' + i + ')">');
                modalHTML = modalHTML.concat('</div>');
            });
            modalHTML = modalHTML.concat('</div>');
            modalHTML = modalHTML.concat('</div>');
            $("#gallery_modal").html(modalHTML);
        }
    });
}

function openGallery() {
    currentSlide(1);
    document.getElementById("gallery_modal").style.display = "block";
}

function closeGallery() {
    document.getElementById("gallery_modal").style.display = "none";
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

var slideIndex = 1;
showSlides(slideIndex);

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("gallery_slides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    // console.log(slides.length);
    if (slides.length != 0) {
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        captionText.innerHTML = dots[slideIndex - 1].alt;
    }
}
// --------------------------------------------------------------------------------------------------------------------

// DOCUMENTS FOR SELECTED EQUIPMENT -----------------------------------------------------------------------------------
function generateDocuments() {
    $.get("/equipment-files/get-documents-by-equipment-id?equipment_id=" + g_selectedEquipment.ID, function (data) {
        var documents = JSON.parse(data);
        var document_name_array = [];

        documents.forEach(document => {
            document_name = document.document_name;
            document_name_array.push(document_name);
        });

        if (documents.length == 0) {
            $('#documents_button').hide();
        } else {
            $("#documents_pop_up").html('');
            documentsHTML = '<div class="pop_up-content">'
            documentsHTML = documentsHTML.concat('<div class="pop_up-header">');
            documentsHTML = documentsHTML.concat('<span class="close" onclick="closePopUp()">×</span>');
            documentsHTML = documentsHTML.concat('<h2>Documents</h2>');
            documentsHTML = documentsHTML.concat('</div>');
            documentsHTML = documentsHTML.concat('<div class="pop_up-body">');
            documentsHTML = documentsHTML.concat('<table class="table_design">');
            documentsHTML = documentsHTML.concat(generateDocumentsHeader());
            documentsHTML = documentsHTML.concat('<tbody>');
            document_name_array.forEach(document_name => {
                documentsHTML = documentsHTML.concat(generateDocumentsRow(document_name));
            });
            documentsHTML = documentsHTML.concat('</tbody>');
            documentsHTML = documentsHTML.concat('</table>');
            documentsHTML = documentsHTML.concat('</div>');
            documentsHTML = documentsHTML.concat('</div>');

            $("#documents_pop_up").html(documentsHTML);
            $('#documents_button').show();
        }
    });
}

function generateDocumentsHeader() {
    var out = '<thead>';
    out = out.concat('<tr>');
    out = out.concat('<th>Filename</th>');
    out = out.concat('<th>File</th>');
    out = out.concat('</tr>');
    out = out.concat('</thead>');

    return out;
}

function generateDocumentsRow(document_name) {
    var filename = document_name.split('filename_')[1];
    out = '<tr>';
    out = out.concat('<td><p>' + filename + '</p></td>');
    out = out.concat('<td>');
    out = out.concat('<a href="/equipment-files/equipment-document?document=' + document_name + '">');
    out = out.concat('<img title="' + document_name + '" src="' + g_imageDirectory + 'icons\\doc.svg">');
    out = out.concat('</a>');
    out = out.concat('</td>');
    out = out.concat('</tr>');

    return out;
}

function openDocuments() {
    $("#documents_pop_up").css("display", "block");
}

function closeDocuments() {
    $("#documents_pop_up").css("display", "none");
}
// --------------------------------------------------------------------------------------------------------------------

// SUGGESTION PANEL ---------------------------------------------------------------------------------------------------

// OWNER SUGGESTION
function updateOwnerSuggestion() {
    if ($("#eq_owner_id").val().length > 1) {
        argString = "?name=" + $("#eq_owner_id").val();
        $.get("/users/get-owner-suggestion-by-name" + argString, function (data) {
            var suggestedUsers = JSON.parse(data);

            if (suggestedUsers.length > 0) {
                $("#suggestions_owner").html('');

                g_owner = [];
                for (var i = 0; i < suggestedUsers.length; i++) {
                    if (i < 5) {
                        g_owner.push(suggestedUsers[i]);
                    }
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_owner, function (i, item) {
                    tableHTML = tableHTML.concat(generateOwnerRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_owner").html(tableHTML);
            } else {
                $("#suggestions_owner").html('');
            }
        });
    } else if ($("#eq_owner_id").val().length == 0 || $("#eq_owner_id").val() == -1) {
        $("#suggestions_owner").html('');
    }
}

function generateOwnerRow(rownNr, user) {
    out = "<tr onclick='selectOwnerRow(" + rownNr.toString() + ")'>";
    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name, 220, rownNr));
    out = out.concat("</td>");
    out = out.concat("</tr>");

    return out;
}

function selectOwnerRow(rownNr) {
    if (rownNr > 0) {
        g_selectedOwner = g_owner[rownNr - 1];
        $("#eq_owner_id").val(g_selectedOwner.user_last_name + ' ' + g_selectedOwner.user_name);
        $("#suggestions_owner").html('');
    }
}

// CO-OWNER SUGGESTION
function updateCoOwnerSuggestion() {
    if ($("#eq_co_owner_id").val().length > 1) {
        argString = "?name=" + $("#eq_co_owner_id").val();
        $.get("/users/get-owner-suggestion-by-name" + argString, function (data) {
            var suggestedUsers = JSON.parse(data);

            if (suggestedUsers.length > 0) {
                $("#suggestions_co_owner").html('');

                g_coOwner = [];
                for (var i = 0; i < suggestedUsers.length; i++) {
                    if (i < 5) {
                        g_coOwner.push(suggestedUsers[i]);
                    }
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_coOwner, function (i, item) {
                    tableHTML = tableHTML.concat(generateCoOwnerRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_co_owner").html(tableHTML);
            } else {
                $("#suggestions_co_owner").html('');
            }
        });
    } else if ($("#eq_co_owner_id").val().length == 0 || $("#eq_co_owner_id").val() == -1) {
        $("#suggestions_co_owner").html('');
    }
}

function generateCoOwnerRow(rownNr, user) {
    out = "<tr onclick='selectCoOwnerRow(" + rownNr.toString() + ")'>";
    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name, 220, rownNr));
    out = out.concat("</td>");
    out = out.concat("</tr>");

    return out;
}

function selectCoOwnerRow(rownNr) {
    if (rownNr > 0) {
        g_selectedCoOwner = g_coOwner[rownNr - 1];
        $("#eq_co_owner_id").val(g_selectedCoOwner.user_last_name + ' ' + g_selectedCoOwner.user_name);
        $("#suggestions_co_owner").html('');
    }
}

// SUPPLIER SUGGESTION
function updateSupplierSuggestion() {
    if ($("#eq_supplier_id").val().length > 1) {
        argString = "?name=" + $("#eq_supplier_id").val();
        $.get("/suppliers/get-supplier-suggestion-by-name" + argString, function (data) {
            var suggestedSuppliers = JSON.parse(data);

            if (suggestedSuppliers.length > 0) {
                $("#suggestions_supplier").html('');

                g_supplier = [];
                for (var i = 0; i < suggestedSuppliers.length; i++) {
                    if (i < 5) {
                        g_supplier.push(suggestedSuppliers[i]);
                    }
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_supplier, function (i, item) {
                    tableHTML = tableHTML.concat(generateSupplierRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_supplier").html(tableHTML);
            } else {
                $("#suggestions_supplier").html('');
            }
        });
    } else if ($("#eq_supplier_id").val().length == 0 || $("#eq_supplier_id").val() == -1) {
        $("#suggestions_supplier").html('');
    }
}

function generateSupplierRow(rownNr, supplier) {
    out = "<tr onclick='selectSupplierRow(" + rownNr.toString() + ")'>";
    out = out.concat('<td>');
    out = out.concat(getTableDiv(supplier.supplier_last_name + ' ' + supplier.supplier_name, 220, rownNr));
    out = out.concat("</td>");
    out = out.concat("</tr>");

    return out;
}

function selectSupplierRow(rownNr) {
    if (rownNr > 0) {
        g_selectedSupplier = g_supplier[rownNr - 1];
        $("#eq_supplier_id").val(g_selectedSupplier.supplier_last_name + ' ' + g_selectedSupplier.supplier_name);
        $("#suggestions_supplier").html('');
    }
}
// --------------------------------------------------------------------------------------------------------------------

// INFORMATION POP UP -------------------------------------------------------------------------------------------------
function showOwnerDetail() {
    $("#owner_info_pop_up").css("display", "block");
}

function showCoOwnerDetail() {
    $("#co_owner_info_pop_up").css("display", "block");
}

function showSupplierDetail() {
    $("#supplier_info_pop_up").css("display", "block");
}

function generateInformationPopUp(type, id) {
    if (type == 'owner') {
        $.get("/users/get-pop-up-info-by-id?ID=" + id, function (data) {
            var owner = JSON.parse(data)[0];

            var name = owner.user_last_name + ' ' + owner.user_name;
            var email = owner.user_email;
            var phone = owner.user_telephone;

            $("#owner_info_pop_up").html('');
            var popUpHTML = generateInformationPopUpHTML('Owner contact details', name, email, phone);
            $("#owner_info_pop_up").html(popUpHTML);
        });
    } else if (type == 'co_owner') {
        $.get("/users/get-pop-up-info-by-id?ID=" + id, function (data) {
            var co_owner = JSON.parse(data)[0];

            var name = co_owner.user_last_name + ' ' + co_owner.user_name;
            var email = co_owner.user_email;
            var phone = co_owner.user_telephone;

            $("#co_owner_info_pop_up").html('');
            var popUpHTML = generateInformationPopUpHTML('Co-owner contact details', name, email, phone);
            $("#co_owner_info_pop_up").html(popUpHTML);
        });
    } else if (type == 'supplier') {
        $.get("/suppliers/get-pop-up-info-by-id?ID=" + id, function (data) {
            var supplier = JSON.parse(data)[0];

            var name = supplier.supplier_last_name + ' ' + supplier.supplier_name;
            var email = supplier.supplier_email;
            var phone = supplier.supplier_phone;
            var comment = supplier.supplier_comment;

            $("#supplier_info_pop_up").html('');
            var popUpHTML = generateInformationPopUpHTML('Supplier contact details', name, email, phone, comment);
            $("#supplier_info_pop_up").html(popUpHTML);
        });
    }
}

function generateInformationPopUpHTML(title, name, email, phone, comment = '') {
    var out = "";
    var out = out.concat('<div class="pop_up-content">');
    var out = out.concat('<div class="pop_up-header">');
    var out = out.concat('<span class="close" onclick="closePopUp()">&times;</span>');
    var out = out.concat('<h2>' + title + '</h2>');
    var out = out.concat('</div>');
    var out = out.concat('<div class="pop_up-body">');
    var out = out.concat('<table class="table_design">');
    var out = out.concat('<thead>');
    var out = out.concat('<tr>');
    var out = out.concat('<th>Name</th>');
    var out = out.concat('<th>Email</th>');
    var out = out.concat('<th>Phone number</th>');
    if (comment != '') {
        var out = out.concat('<th>Comment</th>');
    }
    var out = out.concat('</tr>');
    var out = out.concat('</thead>');
    var out = out.concat('<tbody>');
    var out = out.concat('<tr>');
    var out = out.concat('<td>');
    var out = out.concat('<p>' + name + '</p>');
    var out = out.concat('</td>');
    var out = out.concat('<td>');
    var out = out.concat('<p>' + email + '</p>');
    var out = out.concat('</td>');
    var out = out.concat('<td>');
    var out = out.concat('<p>' + phone + '</p>');
    var out = out.concat('</td>');
    if (comment != '') {
        var out = out.concat('<td>');
        var out = out.concat('<p>' + comment + '</p>');
        var out = out.concat('</td>');
    }
    var out = out.concat('</tr>');
    var out = out.concat('</tbody>');
    var out = out.concat('</table>');
    var out = out.concat('</div>');
    var out = out.concat('</div>');

    return out;
}

function closePopUp() {
    $(".pop_up").css("display", "none");
}
// --------------------------------------------------------------------------------------------------------------------