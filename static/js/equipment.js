var g_equipment;
var g_selectedEquipment;
var g_selectedRow = -1;

var g_owner;
var g_selectedOwner;
var g_coOwner;
var g_selectedCoOwner;
var g_supplier;
var g_selectedSupplier;

var g_imageDirectory = "static\\images\\upload\\";

$(document).ready(function () {
    getEquipment();
});

function getEquipment(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/getEquipment", function (data, status) {
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

            $("#equipmentTable").html(tableHTML);
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
    out = out.concat('Outcome');
    out = out.concat("</th>");

    out = out.concat("<th onclick='sortColumnEquipment(3)'>");
    out = out.concat('Purchase Price');
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
    out = out.concat(getTableDiv(equipment.equipment_name, 600, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_outcome, 250, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_purchase_price, 150, rownNr));
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

function selectRowEquipment(row) {
    if (typeof row == 'number') {
        rowNr = row
    } else {
        rowNr = row.rowIndex;
    }

    var rowNr_data = getJSONFromTable(rowNr);

    var table = document.getElementById("equipmentTable");
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
    loadImagesFromDirectory(g_imageDirectory);

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
    } else if (g_selectedEquipment.equipment_is_mobile == -1) {
        $("#eq_is_mobile").prop("checked", false);
    } else {
        $("#eq_is_mobile").prop("checked", false);
    }
    $("#suggestions_owner").empty();
    if (g_selectedEquipment.equipment_owner_id == -1 || g_selectedEquipment.equipment_owner_id == "") {
        $("#eq_owner_id").val("");
    } else {
        argString = "?ID=" + g_selectedEquipment.equipment_owner_id;
        $.get("/getUserByID" + argString, function (data, status) {
            var owner = JSON.parse(data)[0];
            $("#eq_owner_id").val(owner.user_last_name + ' ' + owner.user_name);
            g_selectedOwner = owner;
        });
    }
    $("#suggestions_co_owner").empty();
    if (g_selectedEquipment.equipment_co_owner_id == -1 || g_selectedEquipment.equipment_co_owner_id == "") {
        $("#eq_co_owner_id").val("");
    } else {
        argString = "?ID=" + g_selectedEquipment.equipment_co_owner_id;
        $.get("/getUserByID" + argString, function (data, status) {
            var coOwner = JSON.parse(data)[0];
            $("#eq_co_owner_id").val(coOwner.user_last_name + ' ' + coOwner.user_name);
            g_selectedCoOwner = coOwner;
        });
    }
    $("#eq_purchase_price").val(g_selectedEquipment.equipment_purchase_price);
    $("#eq_annual_cost").val(g_selectedEquipment.equipment_annual_cost);
    $("#eq_annual_cost_budget").val(g_selectedEquipment.equipment_annual_cost_budget);
    $("#suggestions_owner").empty();

    if (g_selectedEquipment.equipment_supplier_id == -1 || g_selectedEquipment.equipment_supplier_id == "") {
        $("#eq_supplier_id").val("");
    } else {
        argString = "?ID=" + g_selectedEquipment.equipment_supplier_id;
        $.get("/getSupplierByID" + argString, function (data, status) {
            var supplier = JSON.parse(data)[0];
            $("#eq_supplier_id").val(supplier.supplier_last_name + ' ' + supplier.supplier_name);
            g_selectedSupplier = supplier;
        });
    }
}

function updateEquip() {
    // g_selectedEquipment = g_equipment[rownNr - 1];
    if (g_selectedEquipment == undefined) {
        showToast('Gelieve een toestel aan te duiden.', '#B08734');
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

    var equipment_owner_id = -1;
    if ($("#eq_owner_id").val() != "") {
        equipment_owner_id = g_selectedOwner.ID;
    }
    argString = argString + "&equipment_owner_id=" + equipment_owner_id;

    var equipment_co_owner_id = -1;
    if ($("#eq_co_owner_id").val() != "") {
        equipment_co_owner_id = g_selectedCoOwner.ID;
    }
    argString = argString + "&equipment_co_owner_id=" + equipment_co_owner_id;

    var equipment_purchase_price = $("#eq_purchase_price").val();
    argString = argString + "&equipment_purchase_price=" + equipment_purchase_price;

    var equipment_annual_cost = $("#eq_annual_cost").val();
    argString = argString + "&equipment_annual_cost=" + equipment_annual_cost;

    var equipment_annual_cost_budget = $("#eq_annual_cost_budget").val();
    argString = argString + "&equipment_annual_cost_budget=" + equipment_annual_cost_budget;

    var equipment_supplier_id = -1;
    if ($("#eq_supplier_id").val() != "") {
        equipment_supplier_id = g_selectedSupplier.ID;
    }
    argString = argString + "&equipment_supplier_id=" + equipment_supplier_id;

    if (g_selectedRow > -1) {
        $.get("/updateEquipment" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                showToast('Equipment is geupdate', '#5DB034');

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
                giveInputWarning("eq_name");
                showToast('Gelieve het toestel een naam te geven', '#B08734');
            }
        });
    }
}

function updateSuggestionOwner() {
    if ($("#eq_owner_id").val().length > 1) {
        argString = "?owner_name=" + $("#eq_owner_id").val();
        $.get("/updateSuggestionOwner" + argString, function (data, status) {
            var suggestedUsers = JSON.parse(data);

            if (suggestedUsers.length > 0) {

                // remove duplicates https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
                g_owner = [];
                let uniqueUser = {};
                for (let i in suggestedUsers) {
                    if (i < 5) {
                        suggestedUser = suggestedUsers[i]['ID'];
                        uniqueUser[suggestedUser] = suggestedUsers[i];
                    } else {
                        break;
                    }
                }
                for (i in uniqueUser) {
                    g_owner.push(uniqueUser[i]);
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_owner, function (i, item) {
                    tableHTML = tableHTML.concat(generateOwnerRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_owner").html(tableHTML);
            } else {
                $("#suggestions_owner").empty();
            }
        });
    } else if ($("#eq_owner_id").val().length == 0 || $("#eq_owner_id").val() == -1) {
        $("#suggestions_owner").empty();
    }
}

function generateOwnerRow(rownNr, user) {

    out = "<tr onclick='selectRowOwner(" + rownNr.toString() + ")'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name, 220, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function selectRowOwner(rownNr) {
    if (rownNr > 0) {
        g_selectedOwner = g_owner[rownNr - 1];
        $("#eq_owner_id").val(g_selectedOwner.user_last_name + ' ' + g_selectedOwner.user_name);
        $("#suggestions_owner").empty();
    }
}

function updateSuggestionCoOwner() {
    if ($("#eq_co_owner_id").val().length > 1) {
        argString = "?owner_name=" + $("#eq_co_owner_id").val();
        $.get("/updateSuggestionOwner" + argString, function (data, status) {
            var suggestedUsers = JSON.parse(data);

            if (suggestedUsers.length > 0) {

                // remove duplicates https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
                g_coOwner = [];
                let uniqueUser = {};
                for (let i in suggestedUsers) {
                    if (i < 5) {
                        suggestedUser = suggestedUsers[i]['ID'];
                        uniqueUser[suggestedUser] = suggestedUsers[i];
                    } else {
                        break;
                    }
                }
                for (i in uniqueUser) {
                    g_coOwner.push(uniqueUser[i]);
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_coOwner, function (i, item) {
                    tableHTML = tableHTML.concat(generateCoOwnerRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_co_owner").html(tableHTML);
            } else {
                $("#suggestions_co_owner").empty();
            }
        });
    } else if ($("#eq_co_owner_id").val().length == 0 || $("#eq_co_owner_id").val() == -1) {
        $("#suggestions_co_owner").empty();
    }
}

function generateCoOwnerRow(rownNr, user) {

    out = "<tr onclick='selectRowCoOwner(" + rownNr.toString() + ")'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(user.user_last_name + ' ' + user.user_name, 220, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function selectRowCoOwner(rownNr) {
    if (rownNr > 0) {
        g_selectedCoOwner = g_coOwner[rownNr - 1];
        $("#eq_co_owner_id").val(g_selectedCoOwner.user_last_name + ' ' + g_selectedCoOwner.user_name);
        $("#suggestions_co_owner").empty();
    }
}

function updateSuggestionSupplier() {
    if ($("#eq_supplier_id").val().length > 1) {
        argString = "?supplier_name=" + $("#eq_supplier_id").val();
        $.get("/updateSuggestionSupplier" + argString, function (data, status) {
            var suggestedSuppliers = JSON.parse(data);

            if (suggestedSuppliers.length > 0) {

                // remove duplicates https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
                g_supplier = [];
                let uniqueSupplier = {};
                for (let i in suggestedSuppliers) {
                    if (i < 5) {
                        suggestedSupplier = suggestedSuppliers[i]['ID'];
                        uniqueSupplier[suggestedSupplier] = suggestedSuppliers[i];
                    } else {
                        break;
                    }
                }
                for (i in uniqueSupplier) {
                    g_supplier.push(uniqueSupplier[i]);
                }

                tableHTML = "<table class='table_design'>"
                $.each(g_supplier, function (i, item) {
                    tableHTML = tableHTML.concat(generateSupplierRow(i + 1, item));
                });
                tableHTML = tableHTML.concat("</table>");

                $("#suggestions_supplier").html(tableHTML);
            } else {
                $("#suggestions_supplier").empty();
            }
        });
    } else if ($("#eq_supplier_id").val().length == 0 || $("#eq_supplier_id").val() == -1) {
        $("#suggestions_supplier").empty();
    }
}

function generateSupplierRow(rownNr, supplier) {

    out = "<tr onclick='selectRowSupplier(" + rownNr.toString() + ")'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(supplier.supplier_last_name + ' ' + supplier.supplier_name, 220, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function selectRowSupplier(rownNr) {
    if (rownNr > 0) {
        g_selectedSupplier = g_supplier[rownNr - 1];
        $("#eq_supplier_id").val(g_selectedSupplier.supplier_last_name + ' ' + g_selectedSupplier.supplier_name);
        $("#suggestions_supplier").empty();
    }
}

function showToast(text, color) {
    const toastHTML = `<div id="toast_pop_up" style="height:32px;background-color:${color};" class="mlbutton">${text}</div>`;

    $("#toast_message").html(toastHTML);

    setTimeout(function () {
        $('#toast_message').fadeOut(500, function () {
            $(this).empty().show();
        });
    }, 1500);
}

function giveInputWarning(inputID) {
    console.log('#' + inputID)
    var input = $('#' + inputID);

    input.css("border-color", "#BA604D");
    input.css("transition", "0.2s");

    setTimeout(function () {
        input.css("border-color", "");
    }, 1500);
}

function clearTextBox() {
    $("#eq_inventory_number").val("");
    $("#eq_label").val("");
    $("#eq_name").val("");
    $("#eq_amount").val("");
    $("#eq_desc").val("");
    $("#eq_outcome").val("");
    $("#eq_purchase_date").val("");
    $("#eq_base_location").val("");
    $("#eq_is_mobile").prop("checked", false);
    $("#eq_owner_id").val("")
    $("#eq_co_owner_id").val("")
    $("#eq_purchase_price").val("");
    $("#eq_annual_cost").val("");
    $("#eq_annual_cost_budget").val("");

    $("#eq_gallery").html("");
    $("#myModal").html("");
    g_selectedEquipment = undefined;
    g_selectedRow = -1;

    $("#suggestions_owner").empty();
    $("#suggestions_co_owner").empty();
    $("#suggestions_supplier").empty();
}

function prepareNewEquip() {
    clearTextBox();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#update_button').css("visibility", "hidden");
    $('#new_button').css("visibility", "hidden");
    $('#delete_button').css("visibility", "hidden");
    $('#add_button').css("visibility", "visible");
    $('#cancel_button').css("visibility", "visible");
}

function cancelNewEquip() {
    clearTextBox();

    var table_temp = document.querySelector("table");
    const tBody = table_temp.tBodies[0];
    const rows_temp = Array.from(tBody.querySelectorAll("tr"));
    rows_temp.forEach(tr => tr.classList.remove("active-row"));

    $('#update_button').css("visibility", "visible");
    $('#new_button').css("visibility", "visible");
    $('#delete_button').css("visibility", "visible");
    $('#add_button').css("visibility", "hidden");
    $('#cancel_button').css("visibility", "hidden");
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

    $.get("/newEquipment" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            $('#update_button').css("visibility", "visible");
            $('#new_button').css("visibility", "visible");
            $('#delete_button').css("visibility", "visible");
            $('#add_button').css("visibility", "hidden");
            $('#cancel_button').css("visibility", "hidden");
            getEquipment();
            clearTextBox();
            showToast('Nieuw equipment is aangemaakt', '#8734B0');
        } else if (data.localeCompare("http400") == 0) {
            giveInputWarning("eq_name");
            $("#suggestions_owner").empty();
            $("#suggestions_co_owner").empty();
            $("#suggestions_supplier").empty();
            showToast('Gelieve het toestel een naam te geven', '#B08734');
        }
    });
}

function deleteEquip() {
    if (g_selectedEquipment == undefined) {
        showToast('Gelieve een toestel aan te duiden.', '#B08734');
        return;
    }
    var ID = g_selectedEquipment.ID;
    argString = "?ID=" + ID;

    $.get("/deleteEquipment" + argString, function (data, status) {
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
        console.log(i, sortedRows[i].innerText.split("\n\t\n")[0], name);
        if (g_selectedEquipment != undefined) {
            if (name == g_selectedEquipment.equipment_name) {
                g_selectedRow = i + 1;
            }
        }
    }
    console.log(g_selectedRow - 1);

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

$(function () {
    $('#submit').click(function () {
        if (g_selectedEquipment != undefined) {
            var form_data = new FormData($('#uploadform')[0]);
            $.ajax({
                type: 'POST',
                url: '/uploadajax_eq?equipment_id=' + g_selectedEquipment.ID,
                data: form_data,
                contentType: false,
                processData: false,
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                argString = "?picture_name=" + data.name;
                argString = argString + "&equipment_id=" + g_selectedEquipment.ID;
                $.get("/newEquipmentPicture" + argString, function (data, status) {
                    if (data.localeCompare("http200") == 0) {
                        showToast('Photo is uploaded', '#5DB034');
                    }
                });
                loadImagesFromDirectory(g_imageDirectory);
                console.log('Photo uploaded!');
            }).fail(function (data) {
                console.error('Photo not uploaded. Error!');
            });
        } else {
            showToast('Gelieve een toestel aan te duiden waar u de foto aan wil toevoegen.', '#B08734');
        }

    });
});

function loadImagesFromDirectory(directory) {
    argString = "?directory=" + directory + "&equipmentID=" + g_selectedEquipment.ID + "&userID=-1";
    $.get("/get_files" + argString, function (data, status) {
        var images = getFromBetween.get(data, '"', '"');
        console.log(images);

        $("#eq_gallery").html("");
        var galleryHTML = '<div class="gallery_row">'
        var i = 0;
        images.forEach(image => {
            i++;
            galleryHTML = galleryHTML.concat('<div class="img-w">');
            galleryHTML = galleryHTML.concat('<img src=' + g_imageDirectory + '' + image + ' onclick="openModal();currentSlide(' + i + ')">');
            galleryHTML = galleryHTML.concat("</div>");
        });
        galleryHTML = galleryHTML.concat('</div>');
        //console.log(galleryHTML)
        $("#eq_gallery").html(galleryHTML);


        $("#myModal").html("");
        var modalHTML = '<span class="close cursor" onclick="closeModal()">&times;</span>';
        modalHTML = modalHTML.concat('<div class="modal-content">');
        j = 0;
        images.forEach(image => {
            j++;
            modalHTML = modalHTML.concat('<div class="mySlides">');
            modalHTML = modalHTML.concat('<div class="numbertext">' + j + '/' + i + '</div>');
            modalHTML = modalHTML.concat('<img src=' + g_imageDirectory + '' + image + ' >');
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
            modalHTML = modalHTML.concat('<img class="demo cursor" src=' + g_imageDirectory + '' + image + ' onclick="currentSlide(' + i + ')">');
            modalHTML = modalHTML.concat('</div>');
        });
        galleryHTML = galleryHTML.concat('</div>');
        modalHTML = modalHTML.concat('</div>');
        $("#myModal").html(modalHTML);

    });
}

function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
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
    console.log(slides.length);
    if (slides.length != 0) {
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        captionText.innerHTML = dots[slideIndex - 1].alt;
    }
}

var getFromBetween = {
    // ALEX C https://stackoverflow.com/questions/14867835/get-substring-between-two-characters-using-javascript
    results: [],
    string: "",
    getFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1) + sub1.length;
        var string1 = this.string.substr(0, SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP, TP);
    },
    removeFromBetween: function (sub1, sub2) {
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
        this.string = this.string.replace(removal, "");
    },
    getAllResults: function (sub1, sub2) {
        // first check to see if we do have both substrings
        if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1, sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1, sub2);

        // if there's more substrings
        if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1, sub2);
        }
        else return;
    },
    get: function (string, sub1, sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1, sub2);
        return this.results;
    }
};