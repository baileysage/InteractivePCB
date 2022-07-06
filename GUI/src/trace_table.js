/*
    Layer table forms the right half of display. The table contains each of the 
    used layers in the design along with check boxes to show/hide the layer.

    The following function interfaces the layers for the project to the GUI.


    Layer table is composed of three parts:
        1. Search bar
        2. Header
        3. Layers

    Search bar allows users to type a word and layer names matching what 
    has been typed will remain while all other entries will be hidden.

    Header simply displays column names for each each column.

    Last layer ,body, displays an entry per used layer that are not
    filtered out.
*/
"use strict";

var pcb        = require("./pcb.js");
var globalData = require("./global.js");
var Table_TraceEntry = require("./render/Table_TraceEntry.js").Table_TraceEntry

function populateTraceTable()
{
    /* Populate header and BOM body. Place into DOM */
    populateTraceHeader();
    populateTraceBody();
}


let filterLayer = "";
function getFilterLayer() 
{
    return filterLayer;
}

function populateTraceHeader()
{
    let layerHead = document.getElementById("tracehead");
    while (layerHead.firstChild) 
    {
        layerHead.removeChild(layerHead.firstChild);
    }

    // Header row
    let tr = document.createElement("TR");
    // Defines the
    let th = document.createElement("TH");

    th.classList.add("visiableCol");


    th.innerHTML = "Trace";
    let span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    th = document.createElement("TH");
    th.innerHTML = "Ohms";
    span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);


    th = document.createElement("TH");
    th.innerHTML = "Inductance";
    span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    layerHead.appendChild(tr);
}

function populateTraceBody()
{
    let traceBody = document.getElementById("tracebody");
    while (traceBody.firstChild) 
    {
        traceBody.removeChild(traceBody.firstChild);
    }

    // remove entries that do not match filter
    for (let trace of globalData.pcb_traces)
    {
        console.log(trace)
        traceBody.appendChild(new Table_TraceEntry(trace));
    }
}

function Filter(s)
{

}

module.exports = {
    populateTraceTable
}