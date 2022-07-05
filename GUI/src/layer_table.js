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
var Table_LayerEntry = require("./render/Table_LayerEntry.js").Table_LayerEntry

function populateLayerTable()
{
    /* Populate header and BOM body. Place into DOM */
    populateLayerHeader();
    populateLayerBody();

    /* Read filter string. Hide BOM elements that dont cintain string entry */
    let filterLayer = document.getElementById("layer-filter");
    Filter(filterLayer.value)
}


function populateRightSideScreenTable()
{
    let layerBody = document.getElementById("layerbody");
    layerBody.removeAttribute("hidden");
    populateLayerTable();
}


let filterLayer = "";
function getFilterLayer() 
{
    return filterLayer;
}

function populateLayerHeader()
{
    let layerHead = document.getElementById("layerhead");
    while (layerHead.firstChild) 
    {
        layerHead.removeChild(layerHead.firstChild);
    }

    // Header row
    let tr = document.createElement("TR");
    // Defines the
    let th = document.createElement("TH");

    th.classList.add("visiableCol");

    let tr2 = document.createElement("TR");
    let thf = document.createElement("TH"); // front
    let thb = document.createElement("TH"); // back
    let thc = document.createElement("TH"); // color

    thf.innerHTML = "Front"
    thb.innerHTML = "Back"
    thc.innerHTML = "Color"
    tr2.appendChild(thf)
    tr2.appendChild(thb)
    tr2.appendChild(thc)

    th.innerHTML = "Visible";
    th.colSpan = 3
    let span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    th = document.createElement("TH");
    th.innerHTML = "Layer";
    th.rowSpan = 2;
    span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    layerHead.appendChild(tr);
    layerHead.appendChild(tr2);
}

function populateLayerBody()
{
    let layerBody = document.getElementById("layerbody");
    while (layerBody.firstChild) 
    {
        layerBody.removeChild(layerBody.firstChild);
    }

    // remove entries that do not match filter
    for (let layer of globalData.layer_list)
    {
        layerbody.appendChild(new Table_LayerEntry(layer[1][globalData.pcb_layers]));
    }
}

function clearRightScreenTable()
{
    let layerBody = document.getElementById("layerbody");
    while (layerBody.firstChild) 
    {
        layerBody.removeChild(layerBody.firstChild);
    }
}

function Filter(s)
{
    s = s.toLowerCase();
    let layerBody = document.getElementById("layerbody");
    
    for (let layer of layerBody.rows)
    {

        if(layer.innerText.trim().toLowerCase().includes(s))
        {
            layer.style.display = "";
        }
        else
        {
            layer.style.display = "none";
        }
    }
   
}

module.exports = {
    clearRightScreenTable, Filter, populateRightSideScreenTable
};
