var c      = require('../config/constantes');

scene.define("GUI", function() {

    var grid = scene('gridGenerator')._context;

    //$( "#panel" ).menu();
    $("#panelBuilding").click(function() {
        if (grid.isBuilding)
        {
            grid.isBuilding = false;
            $("#panelBuilding").css('background-position', '0px 0px');
        }
        else
        {
            grid.isBuilding = true;
            $("#panelBuilding").css('background-position', '0px 80px');
        }
    });
});