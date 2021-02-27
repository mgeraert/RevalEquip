
var g_equipment;
var g_selectedEquipment;
var g_selectedRow = -1;

var g_owner;
var g_selectedOwner;
var g_coOwner;
var g_selectedCoOwner;

$(document).ready(function () {
    getEquipment();
});

function getEquipment(enableSelectedRow = false, enableSort = false, sortAsc = false, sortColumn = 0) {
    $.get("/getEquipment", function (data, status) {
        g_equipment = JSON.parse(data);
        if (g_equipment.length > 0) {
            tableHTML = "<table id='blue_table' class='blueTable table-sortable'>"
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

    out = "<tr onclick='selectRowEquipment(this)'>";

    out = out.concat('<td>');
    out = out.concat(getTableDiv(rownNr.toString(), 32, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_name, 400, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_outcome, 200, rownNr));
    out = out.concat("</td>");

    out = out.concat('<td>');
    out = out.concat(getTableDiv(equipment.equipment_purchase_price, 75, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function getTableDiv(content, width, rownNr) {

    if (content == null) {
        content = '';
    }

    out = '<div style="overflow:hidden; width:' + width.toString() + 'px;">';
    out = out.concat(content);
    out = out.concat('</div>');
    return out;
}

function selectRowEquipment(row) {
    if(typeof row == 'number') {
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
        rows_temp.forEach(tr => tr.style.backgroundColor = null);
    }
    selectedRow = rows[rowNr];
    selectedRow.style.backgroundColor = '#A7DF62';
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

}

function updateEquip() {
    // g_selectedEquipment = g_equipment[rownNr - 1];
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
        // var ownerFullName = $("#eq_owner_id").val();
        // // naam in hoofdletters = achternaam
        // var ownerLastName = ownerFullName.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g)[0];
        // var ownerName = ownerFullName.split(" ").splice(-1);
        // argString = "?user_last_name=" + ownerLastName + "&user_name=" + ownerName
        // $.get("/getUserIDByUserName" + argString, function (data, status) {
        //     var ID = JSON.parse(data)[0].ID;
        //     window.equipment_owner_id = ID;
        // });
    }
    argString = argString + "&equipment_owner_id=" + equipment_owner_id;
    
    var equipment_co_owner_id = -1;
    if ($("#eq_co_owner_id").val() != "") {
        equipment_co_owner_id = g_selectedCoOwner.ID;
        // var coOwnerFullName = $("#eq_co_owner_id").val();
        // // naam in hoofdletters = achternaam
        // var coOwnerLastName = coOwnerFullName.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g)[0];
        // var coOwnerName = coOwnerFullName.split(" ").splice(-1);
        // argString = "?user_last_name=" + coOwnerLastName + "&user_name=" + coOwnerName
        // $.get("/getUserIDByUserName" + argString, function (data, status) {
        //     var ID = JSON.parse(data)[0].ID;
        //     window.equipment_co_owner_id = ID;
        // });
    }
    argString = argString + "&equipment_co_owner_id=" + equipment_co_owner_id;

    var equipment_purchase_price = $("#eq_purchase_price").val();
    argString = argString + "&equipment_purchase_price=" + equipment_purchase_price;

    var equipment_annual_cost = $("#eq_annual_cost").val();
    argString = argString + "&equipment_annual_cost=" + equipment_annual_cost;

    var equipment_annual_cost_budget = $("#eq_annual_cost_budget").val();
    argString = argString + "&equipment_annual_cost_budget=" + equipment_annual_cost_budget;

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
                    } else{
                        getEquipment(true, true, false, columnNr)
                    }
                } else {
                    getEquipment(true);
                }
                

            }
        });
    }
}

function updateSuggestionOwner() {
    if ($("#eq_owner_id").val().length > 1) {
        argString = "?owner_name=" + $("#eq_owner_id").val();
        $.get("/updateSuggestion" + argString, function (data, status) {
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
                
                tableHTML = "<table class='blueTable'>"
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
    out = out.concat(getTableDiv(user.user_last_name +' '+ user.user_name, 400, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function selectRowOwner(rownNr) {
    if (rownNr > 0) {
        g_selectedOwner = g_owner[rownNr-1];
        $("#eq_owner_id").val(g_selectedOwner.user_last_name + ' ' + g_selectedOwner.user_name);
        $("#suggestions_owner").empty();
    }
}

function updateSuggestionCoOwner() {
    if ($("#eq_co_owner_id").val().length > 1) {
        argString = "?owner_name=" + $("#eq_co_owner_id").val();
        $.get("/updateSuggestion" + argString, function (data, status) {
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
                
                tableHTML = "<table class='blueTable'>"
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
    out = out.concat(getTableDiv(user.user_last_name +' '+ user.user_name, 400, rownNr));
    out = out.concat("</td>");

    out = out + "</tr>";

    return out;
}

function selectRowCoOwner(rownNr) {
    if (rownNr > 0) {
        g_selectedCoOwner = g_coOwner[rownNr-1];
        $("#eq_co_owner_id").val(g_selectedCoOwner.user_last_name + ' ' + g_selectedCoOwner.user_name);
        $("#suggestions_co_owner").empty();
    }
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

function resetTextBox(){
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

    getEquipment();
    $("#suggestions_owner").empty();
    showToast('Velden gereset', '#349BB0');
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

    $.get("/newEquipment" + argString, function (data, status) {
        if (data.localeCompare("http200") == 0) {
            getEquipment();
            showToast('Nieuw equipment is aangemaakt', '#8734B0');
        }
    });
}

function deleteEquip() {
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
                    getUsers(false, true, true, columnNr)
                } else{
                    getUsers(false, true, false, columnNr)
                }
            } else {
                getUsers();
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

    console.log(rows);
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
    for(var i =0,row;row = table.rows[i];i++){
         var col = row.cells;
         var jsonObj = {
             elem : col[0].innerHTML
           }
  
        jsonArr.push(jsonObj);
    }

    var ID = getNumbersFromString(jsonArr[rowNr-1].elem)[1];
    return ID;
}

function getNumbersFromString(string) {    
    var regex = /\d+/g;
    var matches = string.match(regex);
    return matches;
}