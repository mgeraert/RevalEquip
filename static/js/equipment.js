
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
            addRowHandlers();

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

function SelectRow(rownNr){

    var table = document.getElementById("equipmentTable");
    var rows = table.getElementsByTagName("tr");
    if (g_SelectedRow>-1){
        PreviouslyselectedRow = rows[g_SelectedRow];
        selectedRow.style.backgroundColor = null;
    }
    selectedRow = rows[rownNr];
    selectedRow.style.backgroundColor  = '#A7DF62';
    g_SelectedRow = rownNr;
    g_selectedEquipment = g_equipment[rownNr-1];
    $("#eq_name").val(g_selectedEquipment.equipment_name);
    $("#eq_desc").val(g_selectedEquipment.equipment_description);
    $("#eq_outcome").val(g_selectedEquipment.equipment_outcome);

}




