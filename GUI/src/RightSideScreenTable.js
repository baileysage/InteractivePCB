"use strict";

var pcb              = require("./pcb.js");
var globalData       = require("./global.js");
var layer_table      = require("./layer_table.js");
var trace_table      = require("./trace_table.js");
var Table_LayerEntry = require("./render/Table_LayerEntry.js").Table_LayerEntry



function populateRightSideScreenTable()
{
    let rightSideTable_LayerTableBody = document.getElementById("layer_table");
    rightSideTable_LayerTableBody.removeAttribute("hidden");

    //let rightSideTable_TraceTableBody = document.getElementById("tracebody");
    //rightSideTable_TraceTableBody.removeAttribute("hidden");

    layer_table.populateLayerTable();
    trace_table.populateTraceTable();
}


module.exports = {
     populateRightSideScreenTable
};
