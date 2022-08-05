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
var Table_TestPointEntry = require("./render/Table_TestPointEntry.js").Table_TestPointEntry

function populateTestPointTable()
{
    /* Populate header and BOM body. Place into DOM */
    populateTestPointHeader();
    populateTestPointBody();
}

let filterLayer = "";
function getFilterTestPoint()
{
    return filterLayer;
}

function populateTestPointHeader()
{
    let layerHead = document.getElementById("testpointhead");
    while (layerHead.firstChild)
    {
        layerHead.removeChild(layerHead.firstChild);
    }

    // Header row
    let tr = document.createElement("TR");
    // Defines the
    let th = document.createElement("TH");

    th.classList.add("visiableCol");

    th.innerHTML = "Test Point";
    let span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    th = document.createElement("TH");
    th.innerHTML = "Expected";
    span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);


    th = document.createElement("TH");
    th.innerHTML = "Description";
    span = document.createElement("SPAN");
    span.classList.add("none");
    th.appendChild(span);
    tr.appendChild(th);

    layerHead.appendChild(tr);
}

function populateTestPointBody()
{
    let testPointBody = document.getElementById("testpointbody");
    while (testPointBody.firstChild)
    {
        testPointBody.removeChild(testPointBody.firstChild);
    }

    // remove entries that do not match filter
    for (let testpoint of globalData.pcb_testpoints)
    {
        console.log(testpoint)
        testPointBody.appendChild(new Table_TestPointEntry(testpoint));
    }
}

function Filter(s)
{

}

module.exports = {
    populateTestPointTable
}
