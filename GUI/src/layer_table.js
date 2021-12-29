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
    populateLayerHeader();
    populateLayerBody();
}

function setFilterLayer(input) 
{
    filterLayer = input.toLowerCase();
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

function highlightFilterLayer(s) 
{
    if (!getFilterLayer()) 
    {
        return s;
    }
    let parts = s.toLowerCase().split(getFilterLayer());
    if (parts.length == 1) 
    {
        return s;
    }
    let r = "";
    let pos = 0;
    for (let i in parts) 
    {
        if (i > 0) 
        {
            r += "<mark class=\"highlight\">" + s.substring(pos, pos + getFilterLayer().length) + "</mark>";
            pos += getFilterLayer().length;
        }
        r += s.substring(pos, pos + parts[i].length);
        pos += parts[i].length;
    }
    return r;
}


function clearLayerTable()
{
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
            //console.log(layer.innerText.trim())
            layer.style.display = "";
        }
        else
        {
            layer.style.display = "none";
        }
    }
   
}

module.exports = {
    setFilterLayer , getFilterLayer, populateLayerTable, populateLayerHeader, populateLayerBody,
    clearLayerTable, Filter
};
