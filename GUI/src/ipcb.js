/* DOM manipulation and misc code */

"use strict";
var Split      = require("split.js");
var globalData = require("./global.js");
var render     = require("./render.js");
var pcb        = require("./pcb.js");
var handlers_mouse    = require("./handlers_mouse.js");
var version           = require("./version.js");


//TODO: GLOBAL VARIABLES
let layerBody = undefined;
let layerHead = undefined;
let bomhead   = undefined;
let bom = undefined;
let bomtable = undefined;

//TODO:  GLOBAL VARIABLE REFACTOR
let filterBOM = "";
function getFilterBOM() 
{
    return filterBOM;
}

function setFilterBOM(input) 
{
    filterBOM = input.toLowerCase();
    populateBomTable();
}


let filterLayer = "";
function getFilterLayer() 
{
    return filterLayer;
}

function setFilterLayer(input) 
{
    filterLayer = input.toLowerCase();
    populateLayerTable();
}

function setDarkMode(value)
{
    if (value)
    {
        let topmostdiv = document.getElementById("topmostdiv");
        topmostdiv.classList.add("dark");
    }
    else
    {
        let topmostdiv = document.getElementById("topmostdiv");
        topmostdiv.classList.remove("dark");
    }
    globalData.writeStorage("darkmode", value);
    render.drawCanvas(globalData.GetAllCanvas().front);
    render.drawCanvas(globalData.GetAllCanvas().back);
}

function createCheckboxChangeHandler(checkbox, bomentry)
{
    return function() 
    {
        if(bomentry.checkboxes.get(checkbox))
        {
            bomentry.checkboxes.set(checkbox,false);
            globalData.writeStorage("checkbox" + "_" + checkbox.toLowerCase() + "_" + bomentry.reference, "false");
        }
        else
        {
            bomentry.checkboxes.set(checkbox,true);
            globalData.writeStorage("checkbox" + "_" + checkbox.toLowerCase() + "_" + bomentry.reference, "true");
        }
        // Save currently highlited row
        let rowid = globalData.getCurrentHighlightedRowId();
        // Redraw the canvas
        render.drawCanvas(globalData.GetAllCanvas().front);
        render.drawCanvas(globalData.GetAllCanvas().back);
        // Redraw the BOM table
        populateBomTable();
        // Render current row so its highlighted
        document.getElementById(rowid).classList.add("highlighted");
        // Set current selected row global variable
        globalData.setCurrentHighlightedRowId(rowid);
        // If highlighted then a special color will be used for the part.
        render.drawHighlights(IsCheckboxClicked(globalData.getCurrentHighlightedRowId(), "placed"));
    };
}

function createRowHighlightHandler(rowid, refs)
{
    return function()
    {
        if (globalData.getCurrentHighlightedRowId())
        {
            if (globalData.getCurrentHighlightedRowId() == rowid)
            {
                return;
            }
            document.getElementById(globalData.getCurrentHighlightedRowId()).classList.remove("highlighted");
        }

        document.getElementById(rowid).classList.add("highlighted");
        globalData.setCurrentHighlightedRowId(rowid);
        globalData.setHighlightedRefs(refs);
        // If highlighted then a special color will be used for the part.
        render.drawHighlights(IsCheckboxClicked(globalData.getCurrentHighlightedRowId(), "placed"));
    }
}

function entryMatches(part)
{
    // check refs
    if (part.reference.toLowerCase().indexOf(getFilterBOM()) >= 0)
    {
        return true;
    }
    // check value
    if (part.value.toLowerCase().indexOf(getFilterBOM())>= 0)
    {
        return true;
    } 

    // Check the displayed attributes
    let additionalAttributes = globalData.getAdditionalAttributes().split(",");
    additionalAttributes     = additionalAttributes.filter(function(e){return e;});
    for (let x of additionalAttributes)
    {
        // remove beginning and trailing whitespace
        x = x.trim();
        if (part.attributes.has(x))
        {
            if(part.attributes.get(x).indexOf(getFilterBOM()) >= 0)
            {
                return true;
            }
        }
    }

    return false;
}

function entryMatchesLayer(layer) 
{
    // check refs
    if (layer.name.toLowerCase().indexOf(getFilterLayer()) >= 0) 
    {
        return true;
    }
    return false;
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


function highlightFilter(s)
{
    if (!getFilterBOM()) 
    {
        return s;
    }
    let parts = s.toLowerCase().split(getFilterBOM());
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
            r += "<mark class=\"highlight\">" + s.substring(pos, pos + getFilterBOM().length) + "</mark>";
            pos += getFilterBOM().length;
        }
        r += s.substring(pos, pos + parts[i].length);
        pos += parts[i].length;
    }
    return r;
}

function createColumnHeader(name, cls, comparator)
{
    let th = document.createElement("TH");
    th.innerHTML = name;
    th.classList.add(cls);
    th.style.cursor = "pointer";
    let span = document.createElement("SPAN");
    span.classList.add("sortmark");
    span.classList.add("none");
    th.appendChild(span);
    th.onclick = function()
    {
        if (globalData.getCurrentSortColumn() && this !== globalData.getCurrentSortColumn()) 
        {
            // Currently sorted by another column
            globalData.getCurrentSortColumn().childNodes[1].classList.remove(globalData.getCurrentSortOrder());
            globalData.getCurrentSortColumn().childNodes[1].classList.add("none");
            globalData.setCurrentSortColumn(null);
            globalData.setCurrentSortOrder(null);
        }

        if (globalData.getCurrentSortColumn() && this === globalData.getCurrentSortColumn()) 
        {
            // Already sorted by this column
            if (globalData.getCurrentSortOrder() == "asc") 
            {
                // Sort by this column, descending order
                globalData.setBomSortFunction(function(a, b) 
                {
                    return -comparator(a, b);
                });
                globalData.getCurrentSortColumn().childNodes[1].classList.remove("asc");
                globalData.getCurrentSortColumn().childNodes[1].classList.add("desc");
                globalData.setCurrentSortOrder("desc");
            } 
            else 
            {
                // Unsort
                globalData.setBomSortFunction(null);
                globalData.getCurrentSortColumn().childNodes[1].classList.remove("desc");
                globalData.getCurrentSortColumn().childNodes[1].classList.add("none");
                globalData.setCurrentSortColumn(null);
                globalData.setCurrentSortOrder(null);
            }
        }
        else
        {
            // Sort by this column, ascending order
            globalData.setBomSortFunction(comparator);
            globalData.setCurrentSortColumn(this);
            globalData.getCurrentSortColumn().childNodes[1].classList.remove("none");
            globalData.getCurrentSortColumn().childNodes[1].classList.add("asc");
            globalData.setCurrentSortOrder("asc");
        }
        populateBomBody();
    }
    return th;
}

// Describes how to sort checkboxes
function CheckboxCompare(stringName)
{
    return (partA, partB) => {
        if (partA.checkboxes.get(stringName) && !partB.checkboxes.get(stringName)) 
        {
            return  1;
        }
        else if (!partA.checkboxes.get(stringName) && partB.checkboxes.get(stringName)) 
        {
            return -1;
        } 
        else
        {
            return 0;
        }
    }
}

// Describes hoe to sort by attributes
function AttributeCompare(stringName)
{
    return (partA, partB) => {
        if (partA.attributes.get(stringName) != partB.attributes.get(stringName))
        {
            return  partA.attributes.get(stringName) > partB.attributes.get(stringName) ? 1 : -1;
        }
        else
        {
            return 0;
        }
    }
}

function populateLayerHeader()
{
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
    let thf = document.createElement("TH");
    let thb = document.createElement("TH");

    thf.innerHTML = "Front"
    thb.innerHTML = "Back"
    tr2.appendChild(thf)
    tr2.appendChild(thb)

    th.innerHTML = "Visible";
    th.colSpan = 2
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

function createLayerCheckboxChangeHandler(layerEntry, isFront) {
    return function() 
    {
        if(isFront)
        {
            if(layerEntry.visible_front)
            {
                pcb.SetLayerVisibility(layerEntry.name, isFront, false);
                globalData.writeStorage("checkbox_layer_front_" + layerEntry.name + "_visible", "false");
            }
            else
            {
                pcb.SetLayerVisibility(layerEntry.name, isFront, true);
                globalData.writeStorage("checkbox_layer_front_" + layerEntry.name + "_visible", "true");
            }
        }
        else
        {
            if(layerEntry.visible_back)
            {
                pcb.SetLayerVisibility(layerEntry.name, isFront, false);
                globalData.writeStorage("checkbox_layer_back_" + layerEntry.name + "_visible", "false");
            }
            else
            {
                pcb.SetLayerVisibility(layerEntry.name, isFront, true);
                globalData.writeStorage("checkbox_layer_back_" + layerEntry.name + "_visible", "true");
            }
        }
    }
}


function populateLayerBody() 
{
    while (layerBody.firstChild) 
    {
        layerBody.removeChild(layerBody.firstChild);
    }
    let layertable =  pcb.GetLayers();

    // remove entries that do not match filter
    for (let i of layertable) 
    {

        if (getFilterLayer() != "")
        {
            if(!entryMatchesLayer(i))
            {
                continue;
            }
        }

        let tr = document.createElement("TR");
        let td = document.createElement("TD");
        let input_front = document.createElement("input");
        let input_back = document.createElement("input");
        input_front.type = "checkbox";
        input_back.type = "checkbox";
        // Assumes that all layers are visible by default.
        if (    (globalData.readStorage( "checkbox_layer_front_" + i.name + "_visible" ) == "true")
             || (globalData.readStorage( "checkbox_layer_front_" + i.name + "_visible" ) == null)
        )
        {
            pcb.SetLayerVisibility(i.name, true, true);
            input_front.checked = true;
        }
        else
        {
            pcb.SetLayerVisibility(i.name, true, false);
            input_front.checked = false;
        }


        if (    (globalData.readStorage( "checkbox_layer_back_" + i.name + "_visible" ) == "true")
             || (globalData.readStorage( "checkbox_layer_back_" + i.name + "_visible" ) == null)
        )
        {
            pcb.SetLayerVisibility(i.name, false, true);
            input_back.checked = true;
        }
        else
        {
            pcb.SetLayerVisibility(i.name, false, false);
            input_back.checked = false;
        }

        
        input_front.onchange = createLayerCheckboxChangeHandler(i, true);
        input_back.onchange  = createLayerCheckboxChangeHandler(i, false);
        td.appendChild(input_front);
        tr.appendChild(td);

        td = document.createElement("TD");
        td.appendChild(input_back);
        tr.appendChild(td);

        // Layer
        td = document.createElement("TD");
        td.innerHTML =highlightFilterLayer(i.name);
        tr.appendChild(td);
        
        layerbody.appendChild(tr);
    }
}

function populateBomHeader() 
{
    while (bomhead.firstChild)
    {
        bomhead.removeChild(bomhead.firstChild);
    }
    
    let tr = document.createElement("TR");
    let th = document.createElement("TH");
    th.classList.add("numCol");
    tr.appendChild(th);


    let additionalCheckboxes = globalData.getBomCheckboxes().split(",");
    additionalCheckboxes     = additionalCheckboxes.filter(function(e){return e});
    globalData.setCheckboxes(additionalCheckboxes);
    for (let x2 of additionalCheckboxes)
    {
        // remove beginning and trailing whitespace
        x2 = x2.trim()
        if (x2) 
        {
            tr.appendChild(createColumnHeader(x2, "Checkboxes", CheckboxCompare(x2)));
        }
    }

    tr.appendChild(createColumnHeader("References", "References", (partA, partB) => {
        if (partA.reference != partB.reference)
        {
            return partA.reference > partB.reference ? 1 : -1;
        }
        else
        {
            return 0;
        }
    }));

    tr.appendChild(createColumnHeader("Value", "Value", (partA, partB) => {
        if (partA.value != partB.value)
        {
            return partA.value > partB.value ? 1 : -1;
        }
        else
        {
            return 0;
        }
    }));

    let additionalAttributes = globalData.getAdditionalAttributes().split(",");
    // Remove null, "", undefined, and 0 values
    additionalAttributes    =additionalAttributes.filter(function(e){return e});
    for (let x of additionalAttributes)
    {
        // remove beginning and trailing whitespace
        x = x.trim()
        if (x) 
        {
            tr.appendChild(createColumnHeader(x, "Attributes", AttributeCompare(x)));
        }
    }

    if(globalData.getCombineValues())
    {
            //XXX: This comparison function is using positive and negative implicit
            tr.appendChild(createColumnHeader("Quantity", "Quantity", (partA, partB) => {
            return partA.quantity - partB.quantity;
            }));
    }

    bomhead.appendChild(tr);

}



////////////////////////////////////////////////////////////////////////////////
// Filter functions are defined here. These let the application filter 
// elements out of the complete bom. 
//
// The filtering function should return true if the part should be filtered out
// otherwise it returns false
////////////////////////////////////////////////////////////////////////////////
function GetBOMForSideOfBoard(location)
{
    let result = pcb.GetBOM();
    switch (location)
    {
    case "F":
        result = pcb.filterBOMTable(result, filterBOM_Front);
        break;
    case "B":
        result = pcb.filterBOMTable(result, filterBOM_Back);
        break;
    default:
        break;
    }
    return result;
}

function filterBOM_Front(part)
{
    let result = true;
    if(part.location == "F")
    {
        result = false;
    }
    return result;
}

function filterBOM_Back(part)
{
    let result = true;
    if(part.location == "B")
    {
        result = false;
    }
    return result;
}

function filterBOM_ByAttribute(part)
{
    let result = false;
    let splitFilterString = globalData.getRemoveBOMEntries().split(",");
    // Remove null, "", undefined, and 0 values
    splitFilterString    = splitFilterString.filter(function(e){return e});

    if(splitFilterString.length > 0 )
    {
        for(let i of splitFilterString)
        {
            // removing beginning and trailing whitespace
            i = i.trim()
            for (let value of part.attributes.values())
            {
                // Id the value is an empty string then dont filter out the entry. 
                // if the value is anything then filter out the bom entry
                if(value != "")
                {
                    if(value == i)
                    {
                        result = true;
                    }
                }
            }
        }
    }
    return result;
}
////////////////////////////////////////////////////////////////////////////////

function GenerateBOMTable()
{
    // Get bom table with elements for the side of board the user has selected
    let bomtableTemp = GetBOMForSideOfBoard(globalData.getCanvasLayout());

    // Apply attribute filter to board
    bomtableTemp = pcb.filterBOMTable(bomtableTemp, filterBOM_ByAttribute);

    // If the parts are displayed one per line (not combined values), then the the bom table needs to be flattened. 
    // By default the data in the json file is combined
    bomtable = globalData.getCombineValues() ? pcb.GetBOMCombinedValues(bomtableTemp) : bomtableTemp;

    return bomtable;
}

function populateBomBody()
{
    while (bom.firstChild)
    {
        bom.removeChild(bom.firstChild);
    }

    globalData.setHighlightHandlers([]);
    globalData.setCurrentHighlightedRowId(null);
    let first = true;

    bomtable = GenerateBOMTable();

    if (globalData.getBomSortFunction())
    {
        bomtable = bomtable.slice().sort(globalData.getBomSortFunction());
    }
    for (let i in bomtable)
    {
        let bomentry = bomtable[i];
        let references = bomentry.reference;

        // remove entries that do not match filter
        if (getFilterBOM() != "")
        {
            if(!entryMatches(bomentry))
            {
                continue;
            }
        }

        // Hide placed parts option is set
        if(globalData.getHidePlacedParts())
        {
            // Remove entries that have been placed. Check the placed parameter
            if(globalData.readStorage( "checkbox" + "_" + "placed" + "_" + bomentry.reference ) == "true")
            {
                continue;
            }
        }

        let tr = document.createElement("TR");
        let td = document.createElement("TD");
        let rownum = +i + 1;
        tr.id = "bomrow" + rownum;
        td.textContent = rownum;
        tr.appendChild(td);

        // Checkboxes
        let additionalCheckboxes = globalData.getBomCheckboxes().split(",");
        for (let checkbox of additionalCheckboxes) 
        {
            checkbox = checkbox.trim();
            if (checkbox) 
            {
                td = document.createElement("TD");
                let input = document.createElement("input");
                input.type = "checkbox";
                input.onchange = createCheckboxChangeHandler(checkbox, bomentry);
                // read the value in from local storage

                if(globalData.readStorage( "checkbox" + "_" + checkbox.toLowerCase() + "_" + bomentry.reference ) == "true")
                {
                    bomentry.checkboxes.set(checkbox,true)
                }
                else
                {
                    bomentry.checkboxes.set(checkbox,false)
                }

                if(bomentry.checkboxes.get(checkbox))
                {
                    input.checked = true;
                }
                else
                {
                    input.checked = false;
                }

                td.appendChild(input);
                tr.appendChild(td);
            }
        }



        //INFO: The lines below add the control the columns on the bom table
        // References
        td = document.createElement("TD");
        td.innerHTML = highlightFilter(references);
        tr.appendChild(td);
        // Value
        td = document.createElement("TD");
        td.innerHTML = highlightFilter(bomentry.value);
        tr.appendChild(td);
        
        // Attributes
        let additionalAttributes = globalData.getAdditionalAttributes().split(",");
        for (let x of additionalAttributes)
        {
            x = x.trim()
            if (x)
            {
                td = document.createElement("TD");
                td.innerHTML = highlightFilter(pcb.getAttributeValue(bomentry, x.toLowerCase()));
                tr.appendChild(td);
            }
        }

        if(globalData.getCombineValues())
        {
            td = document.createElement("TD");
            td.textContent = bomentry.quantity;
            tr.appendChild(td);
        }
        bom.appendChild(tr);


        bom.appendChild(tr);
        let handler = createRowHighlightHandler(tr.id, references);
        tr.onclick = handler;
        globalData.pushHighlightHandlers({
            id: tr.id,
            handler: handler,
            refs: references
        });

        if (getFilterBOM() && first)
        {
            handler();
            first = false;
        }
    }
}

function highlightPreviousRow()
{
    if (!globalData.getCurrentHighlightedRowId())
    {
        globalData.getHighlightHandlers()[globalData.getHighlightHandlers().length - 1].handler();
    }
    else
    {
        if (    (globalData.getHighlightHandlers().length > 1)
             && (globalData.getHighlightHandlers()[0].id == globalData.getCurrentHighlightedRowId())
        )
        {
            globalData.getHighlightHandlers()[globalData.getHighlightHandlers().length - 1].handler();
        }
        else
        {
            for (let i = 0; i < globalData.getHighlightHandlers().length - 1; i++)
            {
                if (globalData.getHighlightHandlers()[i + 1].id == globalData.getCurrentHighlightedRowId())
                {
                    globalData.getHighlightHandlers()[i].handler();
                    break;
                }
            }
        }
    }
    render.smoothScrollToRow(globalData.getCurrentHighlightedRowId());
}

function highlightNextRow()
{
    if (!globalData.getCurrentHighlightedRowId())
    {
        globalData.getHighlightHandlers()[0].handler();
    }
    else
    {
        if (    (globalData.getHighlightHandlers().length > 1)
             && (globalData.getHighlightHandlers()[globalData.getHighlightHandlers().length - 1].id == globalData.getCurrentHighlightedRowId())
        )
        {
            globalData.getHighlightHandlers()[0].handler();
        }
        else
        {
            for (let i = 1; i < globalData.getHighlightHandlers().length; i++)
            {
                if (globalData.getHighlightHandlers()[i - 1].id == globalData.getCurrentHighlightedRowId())
                {
                    globalData.getHighlightHandlers()[i].handler();
                    break;
                }
            }
        }
    }
    smoothScrollToRow(globalData.getCurrentHighlightedRowId());
}

function populateLayerTable()
{
    populateLayerHeader();
    populateLayerBody();
}

function populateBomTable()
{
    populateBomHeader();
    populateBomBody();
}

function modulesClicked(references)
{
    let lastClickedIndex = references.indexOf(globalData.getLastClickedRef());
    let ref = references[(lastClickedIndex + 1) % references.length];
    for (let handler of globalData.getHighlightHandlers()) 
    {
        if (handler.refs.indexOf(ref) >= 0)
        {
            globalData.setLastClickedRef(ref);
            handler.handler();
            smoothScrollToRow(globalData.getCurrentHighlightedRowId());
            break;
        }
    }
}

function silkscreenVisible(visible)
{
    if (visible)
    {
        globalData.GetAllCanvas().front.silk.style.display = "";
        globalData.GetAllCanvas().back.silk.style.display = "";
        globalData.writeStorage("silkscreenVisible", true);
    }
    else
    {
        globalData.GetAllCanvas().front.silk.style.display = "none";
        globalData.GetAllCanvas().back.silk.style.display = "none";
        globalData.writeStorage("silkscreenVisible", false);
    }
}

function changeCanvasLayout(layout) 
{
    document.getElementById("fl-btn").classList.remove("depressed");
    document.getElementById("fb-btn").classList.remove("depressed");
    document.getElementById("bl-btn").classList.remove("depressed");

    switch (layout) 
    {
    case "F":
        document.getElementById("fl-btn").classList.add("depressed");
        if (globalData.getBomLayout() != "BOM") 
        {
            globalData.collapseCanvasSplit(1);
        }
        break;
    case "B":
        document.getElementById("bl-btn").classList.add("depressed");
        if (globalData.getBomLayout() != "BOM") 
        {
            globalData.collapseCanvasSplit(0);
        }
        break;
    default:
        document.getElementById("fb-btn").classList.add("depressed");
        if (globalData.getBomLayout() != "BOM") 
        {
            globalData.setSizesCanvasSplit([50, 50]);
        }
        break;
    }

    globalData.setCanvasLayout(layout);
    globalData.writeStorage("canvaslayout", layout);
    render.resizeAll();
    populateBomTable();
}

function populateMetadata()
{
    let metadata  = pcb.GetMetadata();
    if(metadata.revision == undefined)
    {
        document.getElementById("revision").innerHTML = "";
    }
    else
    {
        document.getElementById("revision").innerHTML = "Revision: " + metadata.revision.toString();;
    }

    if(metadata.company == undefined)
    {
        document.getElementById("company").innerHTML = "";
    }
    else
    {
        document.getElementById("company").innerHTML  = metadata.company;
    }

    if(metadata.title == undefined)
    {
         document.getElementById("title").innerHTML = "";
    }
    else
    {
         document.getElementById("title").innerHTML = metadata.title;
    }

    if(metadata.date == undefined)
    {
         document.getElementById("filedate").innerHTML = "";
    }
    else
    {
         document.getElementById("filedate").innerHTML = metadata.date;
    }
}


let layerVisable = true;
document.getElementById("lay-btn").classList.add("depressed");
function toggleLayers()
{
    if (layerVisable)
    {
        layerVisable = false;
        document.getElementById("lay-btn").classList.remove("depressed");
        document.getElementById("layerdiv").style.display = "none";
        globalData.destroyLayerSplit();
        globalData.setLayerSplit(null);
    }
    else
    {
        layerVisable = true;
        document.getElementById("lay-btn").classList.add("depressed");
        document.getElementById("layerdiv").style.display = "";
        globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
            sizes: [80, 20],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "col-resize"
        }));
    }
}

function changeBomLayout(layout)
{
    document.getElementById("bom-btn").classList.remove("depressed");
    document.getElementById("bom-lr-btn").classList.remove("depressed");
    document.getElementById("bom-tb-btn").classList.remove("depressed");
    document.getElementById("pcb-btn").classList.remove("depressed");
    switch (layout) 
    {
    case "BOM":
        document.getElementById("bom-btn").classList.add("depressed");
        if (globalData.getBomSplit()) 
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }
        document.getElementById("bomdiv").style.display = "";
        document.getElementById("frontcanvas").style.display = "none";
        document.getElementById("backcanvas").style.display = "none";
        document.getElementById("layerdiv").style.display = "none";
        document.getElementById("bot").style.height = "";
        break;
    case "PCB":
        document.getElementById("pcb-btn"     ).classList.add("depressed");
        document.getElementById("bomdiv").style.display = "none";
        document.getElementById("frontcanvas").style.display = "";
        document.getElementById("backcanvas" ).style.display = "";
        document.getElementById("layerdiv"   ).style.display = "";
        document.getElementById("bot"        ).style.height = "calc(100% - 80px)";
        
        document.getElementById("datadiv"   ).classList.add(   "split-horizontal");
        document.getElementById("bomdiv"     ).classList.remove(   "split-horizontal");
        document.getElementById("canvasdiv"  ).classList.remove(   "split-horizontal");
        document.getElementById("frontcanvas").classList.add(   "split-horizontal");
        document.getElementById("backcanvas" ).classList.add(   "split-horizontal");
        document.getElementById("layerdiv"   ).classList.add(   "split-horizontal");


        if (globalData.getBomSplit())
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
            sizes: [80, 20],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "col-resize"
        }));

        globalData.setBomSplit(Split(["#bomdiv", "#canvasdiv"], {
            direction: "vertical",
            sizes: [50, 50],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "row-resize"
        }));

        globalData.setCanvasSplit(Split(["#frontcanvas", "#backcanvas"], {
            sizes: [50, 50],
            gutterSize: 5,
            onDragEnd: render.resizeAll,
            cursor: "row-resize"
        }));

        document.getElementById("canvasdiv"  ).style.height = "calc(100% - 2.5px)";
        break;
    case "TB":
        document.getElementById("bom-tb-btn"     ).classList.add("depressed");
        document.getElementById("bomdiv").style.display = "";
        document.getElementById("frontcanvas").style.display = "";
        document.getElementById("backcanvas" ).style.display = "";
        document.getElementById("layerdiv"   ).style.display = "";
        document.getElementById("bot"        ).style.height = "calc(100% - 80px)";

        document.getElementById("datadiv"   ).classList.add(   "split-horizontal");
        document.getElementById("bomdiv"     ).classList.remove(   "split-horizontal");
        document.getElementById("canvasdiv"  ).classList.remove(   "split-horizontal");
        document.getElementById("frontcanvas").classList.add(   "split-horizontal");
        document.getElementById("backcanvas" ).classList.add(   "split-horizontal");
        document.getElementById("layerdiv"   ).classList.add(   "split-horizontal");


        if (globalData.getBomSplit())
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
            sizes: [80, 20],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "col-resize"
        }));

        globalData.setBomSplit(Split(["#bomdiv", "#canvasdiv"], {
            direction: "vertical",
            sizes: [50, 50],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "row-resize"
        }));

        globalData.setCanvasSplit(Split(["#frontcanvas", "#backcanvas"], {
            sizes: [50, 50],
            gutterSize: 5,
            onDragEnd: render.resizeAll,
            cursor: "row-resize"
        }));


        break;
    case "LR":
        document.getElementById("bom-lr-btn"     ).classList.add("depressed");
        document.getElementById("bomdiv").style.display = "";
        document.getElementById("frontcanvas").style.display = "";
        document.getElementById("backcanvas" ).style.display = "";
        document.getElementById("layerdiv"   ).style.display = "";
        document.getElementById("bot"        ).style.height = "calc(100% - 80px)";

        document.getElementById("datadiv"    ).classList.add(   "split-horizontal");
        document.getElementById("bomdiv"     ).classList.add(   "split-horizontal");
        document.getElementById("canvasdiv"  ).classList.add(   "split-horizontal");
        document.getElementById("frontcanvas").classList.remove(   "split-horizontal");
        document.getElementById("backcanvas" ).classList.remove(   "split-horizontal");
        document.getElementById("layerdiv"   ).classList.add(   "split-horizontal");

        if (globalData.getBomSplit())
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
            sizes: [80, 20],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "col-resize"
        }));

        globalData.setBomSplit(Split(["#bomdiv", "#canvasdiv"], {
            sizes: [50, 50],
            onDragEnd: render.resizeAll,
            gutterSize: 5,
            cursor: "row-resize"
        }));

        globalData.setCanvasSplit(Split(["#frontcanvas", "#backcanvas"], {
            sizes: [50, 50],
            direction: "vertical",
            gutterSize: 5,
            onDragEnd: render.resizeAll,
            cursor: "row-resize"
        }));
        break;
    }
    globalData.setBomLayout(layout);
    globalData.writeStorage("bomlayout", layout);
    changeCanvasLayout(globalData.getCanvasLayout());
}

function focusInputField(input)
{
    input.scrollIntoView(false);
    input.focus();
    input.select();
}

function focusBOMFilterField()
{
    focusInputField(document.getElementById("bom-filter"));
}

function toggleBomCheckbox(bomrowid, checkboxnum)
{
    if (!bomrowid || checkboxnum > globalData.getCheckboxes().length)
    {
        return;
    }
    let bomrow = document.getElementById(bomrowid);
    let checkbox = bomrow.childNodes[checkboxnum].childNodes[0];
    checkbox.checked = !checkbox.checked;
    checkbox.indeterminate = false;
    checkbox.onchange();
}

function IsCheckboxClicked(bomrowid, checkboxname) 
{
    let checkboxnum = 0;
    while (checkboxnum < globalData.getCheckboxes().length && globalData.getCheckboxes()[checkboxnum].toLowerCase() != checkboxname.toLowerCase()) 
    {
        checkboxnum++;
    }
    if (!bomrowid || checkboxnum >= globalData.getCheckboxes().length) 
    {
        return;
    }
    let bomrow = document.getElementById(bomrowid);
    let checkbox = bomrow.childNodes[checkboxnum + 1].childNodes[0];
    return checkbox.checked;
}

function removeGutterNode(node)
{
    for (let i = 0; i < node.childNodes.length; i++)
    {
        if (    (node.childNodes[i].classList )
             && (node.childNodes[i].classList.contains("gutter")) 
        )
        {
            node.removeChild(node.childNodes[i]);
            break;
        }
    }
}

function cleanGutters()
{
    removeGutterNode(document.getElementById("bot"));
    removeGutterNode(document.getElementById("canvasdiv"));
}

function setBomCheckboxes(value)
{
    globalData.setBomCheckboxes(value);
    globalData.writeStorage("bomCheckboxes", value);
    populateBomTable();
}

function setRemoveBOMEntries(value)
{
    globalData.setRemoveBOMEntries(value);
    globalData.writeStorage("removeBOMEntries", value);
    populateBomTable();
}

function setAdditionalAttributes(value)
{
    globalData.setAdditionalAttributes(value);
    globalData.writeStorage("additionalAttributes", value);
    populateBomTable();
}

// XXX: None of this seems to be working. 
document.onkeydown = function(e)
{
    switch (e.key)
    {
    case "n":
        if (document.activeElement.type == "text")
        {
            return;
        }
        if (globalData.getCurrentHighlightedRowId() !== null)
        {
            // XXX: Why was the following line in the software
            //checkBomCheckbox(globalData.getCurrentHighlightedRowId(), "placed");
            highlightNextRow();
            e.preventDefault();
        }
        break;
    case "ArrowUp":
        highlightPreviousRow();
        e.preventDefault();
        break;
    case "ArrowDown":
        highlightNextRow();
        e.preventDefault();
        break;
    default:
        break;
    }

    if (e.altKey)
    {
        switch (e.key)
        {
        case "f":
            focusBOMFilterField();
            e.preventDefault();
            break;
        case "z":
            changeBomLayout("BOM");
            e.preventDefault();
            break;
        case "x":
            changeBomLayout("LR");
            e.preventDefault();
            break;
        case "c":
            changeBomLayout("TB");
            e.preventDefault();
            break;
        case "v":
            changeCanvasLayout("F");
            e.preventDefault();
            break;
        case "b":
            changeCanvasLayout("FB");
            e.preventDefault();
            break;
        case "n":
            changeCanvasLayout("B");
            e.preventDefault();
            break;
        default:
            break;
        }
    }
};

//XXX: I would like this to be in the html functions js file. But this function needs to be 
//     placed here, otherwise the application rendering becomes very very weird.
window.onload = function(e)
{
    console.time("on load");
    // This function makes so that the user data for the pcb is converted to our internal structure
    pcb.OpenPcbData(pcbdata)

    let versionNumberHTML = document.getElementById("softwareVersion");
    versionNumberHTML.innerHTML = version.GetVersionString();
    // Create canvas layers. One canvas per pcb layer

    globalData.initStorage();
    cleanGutters();
    // Must be called after loading PCB as rendering required the bounding box information for PCB
    render.initRender();

    // Set up mouse event handlers
    handlers_mouse.addMouseHandlers(document.getElementById("frontcanvas"), globalData.GetAllCanvas().front);
    handlers_mouse.addMouseHandlers(document.getElementById("backcanvas"), globalData.GetAllCanvas().back);


    bom = document.getElementById("bombody");
    layerBody = document.getElementById("layerbody");
    layerHead = document.getElementById("layerhead");
    bomhead = document.getElementById("bomhead");
    globalData.setBomLayout(globalData.readStorage("bomlayout"));
    if (!globalData.getBomLayout())
    {
        globalData.setBomLayout("LR");
    }
    globalData.setCanvasLayout(globalData.readStorage("canvaslayout"));
    if (!globalData.getCanvasLayout())
    {
        globalData.setCanvasLayout("FB");
    }

    populateLayerTable();

    populateMetadata();
    globalData.setBomCheckboxes(globalData.readStorage("bomCheckboxes"));
    if (globalData.getBomCheckboxes() === null)
    {
        globalData.setBomCheckboxes("Placed");
    }
    globalData.setRemoveBOMEntries(globalData.readStorage("removeBOMEntries"));
    if (globalData.getRemoveBOMEntries() === null)
    {
        globalData.setRemoveBOMEntries("");
    }
    globalData.setAdditionalAttributes(globalData.readStorage("additionalAttributes"));
    if (globalData.getAdditionalAttributes() === null)
    {
        globalData.setAdditionalAttributes("");
    }
    document.getElementById("bomCheckboxes").value = globalData.getBomCheckboxes();
    if (globalData.readStorage("silkscreenVisible") === "false")
    {
        document.getElementById("silkscreenCheckbox").checked = false;
        silkscreenVisible(false);
    }
    if (globalData.readStorage("redrawOnDrag") === "false")
    {
        document.getElementById("dragCheckbox").checked = false;
        globalData.setRedrawOnDrag(false);
    }
    if (globalData.readStorage("darkmode") === "true")
    {
        document.getElementById("darkmodeCheckbox").checked = true;
        setDarkMode(true);
    }
    if (globalData.readStorage("hidePlacedParts") === "true")
    {
        document.getElementById("hidePlacedParts").checked = true;
        globalData.setHidePlacedParts(true);
    }
    if (globalData.readStorage("highlightpin1") === "true")
    {
        document.getElementById("highlightpin1Checkbox").checked = true;
        globalData.setHighlightPin1(true);
        render.drawCanvas(globalData.GetAllCanvas().front);
        render.drawCanvas(globalData.GetAllCanvas().back);
    }
    // If this is true then combine parts and display quantity
    if (globalData.readStorage("combineValues") === "true")
    {
        document.getElementById("combineValues").checked = true;
        globalData.setCombineValues(true);
    }
    if (globalData.readStorage("debugMode") === "true")
    {
        document.getElementById("debugMode").checked = true;
        globalData.setDebugMode(true);
    }
    // Read the value of board rotation from local storage
    let boardRotation = globalData.readStorage("boardRotation");
    /*
      Adjusted to match how the update rotation angle is calculated.
    
        If null, then angle not in local storage, set to 180 degrees.
      */
    if (boardRotation === null)
    {
        boardRotation = 180;
    }
    else
    {
        boardRotation = parseInt(boardRotation);
    }
    // Set internal global variable for board rotation.
    globalData.SetBoardRotation(boardRotation);
    document.getElementById("boardRotation").value = (boardRotation-180) / 5;
    document.getElementById("rotationDegree").textContent = (boardRotation-180);

    // Triggers render
    changeBomLayout(globalData.getBomLayout());
    console.timeEnd("on load");
};

window.onresize = render.resizeAll;
window.matchMedia("print").addListener(render.resizeAll);

module.exports = {
    setDarkMode        , silkscreenVisible      , changeBomLayout, changeCanvasLayout,
    setBomCheckboxes   , populateBomTable       , setFilterBOM   , getFilterBOM      ,
    setFilterLayer     , getFilterLayer         , setRemoveBOMEntries, setAdditionalAttributes,
    toggleLayers
};
