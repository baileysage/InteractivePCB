"use strict";

var globalData = require("../global.js");
var colorMap   = require("../colormap.js");

class Table_TraceEntry
{
    constructor(trace)
    {

        let tr = document.createElement("TR");
        
        // trace name
        let td = document.createElement("TD");
        td.innerHTML = trace.name;
        tr.appendChild(td);
        
        td = document.createElement("TD");
        td.innerHTML = "0.0 Omega";
        tr.appendChild(td);

        td = document.createElement("TD");
        td.innerHTML = "0.0 L";
        tr.appendChild(td);
        

        return tr;
    }
}

module.exports = {
    Table_TraceEntry
};
