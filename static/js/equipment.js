
var g_equipment;
var g_selectedEquipment;
var g_SelectedRow = -1;

$(document).ready(function () {



    GetEquipment();




});

function GetEquipment() {
    $.get("/GetEquipment", function (data, status) {
        g_equipment = JSON.parse(data);
        if (g_equipment.length > 0) {
            tableHTML = "<table class='blueTable'>"
            tableHTML = tableHTML.concat(GenerateTableHeader());
            $.each(g_equipment, function (i, item) {

                tableHTML = tableHTML.concat(GenerateTabelRow(i + 1, item));
            });
            tableHTML = tableHTML.concat("</table>");

            $("#equipmentTable").html(tableHTML);
            // addRowHandlers();

            SelectRow(g_SelectedRow);
        }
    });
}

function GenerateTableHeader() {
    out = "<tr>";

    out = out.concat('<th>');
    out = out.concat("#");
    out = out.concat("</th>");

    out = out.concat('<th>');
    out = out.concat('Name');
    out = out.concat("</th>");

    out = out.concat('<th>');
    out = out.concat('Outcome');
    out = out.concat("</th>");

    out = out.concat('<th>');
    out = out.concat('Purchase Price');
    out = out.concat("</th>");

    out = out.concat("</tr>");

    return out;
}


function GenerateTabelRow(rownNr, equipment) {

    out = "<tr onclick='SelectRow(" + rownNr.toString() + ")'>";

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

    out = '<div style="overflow:hidden; width:' + width.toString() + 'px;';
    out = out.concat('title:"' + content + '"');
    out = out.concat(' onclick="">');
    out = out.concat(content);
    out = out.concat('</div>');
    return out;
}

function SelectRow(rownNr) {
    var table = document.getElementById("equipmentTable");
    var rows = table.getElementsByTagName("tr");
    if (g_SelectedRow > -1) {
        PreviouslyselectedRow = rows[g_SelectedRow];
        selectedRow.style.backgroundColor = null;
    }
    selectedRow = rows[rownNr];
    selectedRow.style.backgroundColor = '#A7DF62';
    g_SelectedRow = rownNr;
    g_selectedEquipment = g_equipment[rownNr - 1];
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

    $("#eq_owner_id").val(g_selectedEquipment.equipment_owner_id);
    $("#eq_co_owner_id").val(g_selectedEquipment.equipment_co_owner_id);
    $("#eq_purchase_price").val(g_selectedEquipment.equipment_purchase_price);
    $("#eq_annual_cost").val(g_selectedEquipment.equipment_annual_cost);
    $("#eq_annual_cost_budget").val(g_selectedEquipment.equipment_annual_cost_budget);

}

function UpdateEquip() {
    // g_selectedEquipment = g_equipment[rownNr - 1];
    var ID = g_selectedEquipment.ID;
    var equipment_inventory_number = $("#eq_inventory_number").val();
    var equipment_label = $("#eq_label").val();
    var equipment_name = $("#eq_name").val();
    var equipment_amount = $("#eq_amount").val();
    var equipment_description = $("#eq_desc").val();
    var equipment_outcome = $("#eq_outcome").val();
    var equipment_purchase_date = $("#eq_purchase_date").val();
    var equipment_base_location = $("#eq_base_location").val();
    var equipment_owner_id = $("#eq_owner_id").val();
    var equipment_co_owner_id = $("#eq_co_owner_id").val();
    var equipment_purchase_price = $("#eq_purchase_price").val();
    var equipment_annual_cost = $("#eq_annual_cost").val();
    var equipment_annual_cost_budget = $("#eq_annual_cost_budget").val();
    // var scrollPos = $("#equipmentTable").scrollTop();

    if (g_SelectedRow > -1) {
        argString = "?ID=" + ID + "&equipment_inventory_number=" + equipment_inventory_number + "&equipment_label=" + equipment_label + "&equipment_name=" + equipment_name + "&equipment_amount=" + equipment_amount + "&equipment_description=" + equipment_description + "&equipment_outcome=" + equipment_outcome + "&equipment_purchase_date=" + equipment_purchase_date + "&equipment_base_location=" + equipment_base_location + "&equipment_owner_id=" + equipment_owner_id + "&equipment_co_owner_id=" + equipment_co_owner_id + "&equipment_purchase_price=" + equipment_purchase_price + "&equipment_annual_cost=" + equipment_annual_cost + "&equipment_annual_cost_budget=" + equipment_annual_cost_budget;

        console.log(argString)
        $.get("/UpdateEquipment" + argString, function (data, status) {
            if (data.localeCompare("http200") == 0) {
                GetEquipment();
            }
        });
    }
}





