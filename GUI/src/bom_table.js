"use strict";
var globalData = require("./global.js");
var pcb        = require("./pcb.js");
var render     = require("./render.js");

function createCheckboxChangeHandler(checkbox, bomentry)
{
    return function(event) 
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
        render.RenderPCB(globalData.GetAllCanvas().front);
        render.RenderPCB(globalData.GetAllCanvas().back);
        // Redraw the BOM table
        populateBomTable();
        // Render current row so its highlighted
        document.getElementById(rowid).classList.add("highlighted");
        // Set current selected row global variable
        if(event.ctrlKey)
        {
            globalData.setCurrentHighlightedRowId(rowid, true);
        }
        else
        {
            globalData.setCurrentHighlightedRowId(rowid, false);
        }
        
        // If highlighted then a special color will be used for the part.
        render.drawHighlights(IsCheckboxClicked(globalData.getCurrentHighlightedRowId(), "placed"));
    };
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

function clearBOMTable()
{
    let bom = document.getElementById("bombody");

    while (bom.firstChild)
    {
        bom.removeChild(bom.firstChild);
    }
}

/*
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

    JS treats values in compare as strings by default
    so need to use a function to sort numerically.
*/
function NumericCompare(a,b)
{
    return (a - b);
}

/*
    Takes as an argument a list of reference designations.
*/
function ConvertReferenceDesignatorsToRanges(ReferenceDesignations)
{
    /*
        Extract reference designation from the list. 
        It is assumed the reference designation is  teh same across all 
        in the input list. 

        In addition also extract the numeric value in a separate list. 
    */
    let numbers    = ReferenceDesignations.map(x => parseInt(x.split(/(\d+$)/)[1],10));
    // Only extract reference designation from first element as all others are assumed to be equal.
    let designator = ReferenceDesignations[0].split(/(\d+$)/)[0];

    /*
        Sort all numbers to be increasing
    */
    numbers.sort(NumericCompare);

    /*
        Following code was adapted from KiCost project. Code ported to JavaScript from Python.
        Removed a check for sub parts as iPCB deals with parts from a PCB perspective and not 
        schematic perspective, this do not need sub part checking.
    */

    // No ranges found yet since we just started.
    let rangedReferenceDesignations = [];
    // First possible range is at the start of the list of numbers.
    let rangeStart = 0;

    // Go through list of numbers looking for 3 or more sequential numbers.
    while(rangeStart < numbers.length)
    {
        // Current range starts off as a single number.
        let numRange = numbers[rangeStart]
        // The next possible start of a range.
        let nextRangeStart = rangeStart + 1;

        // Look for sequences of three or more sequential numbers.
        for(let rangeEnd = (rangeStart+2); rangeEnd < numbers.length; rangeEnd++)
        {
            if(rangeEnd - rangeStart != numbers[rangeEnd] - numbers[rangeStart])
            {
                // Non-sequential numbers found, so break out of loop.
                break;
            }
            else
            {
                // Otherwise, extend the current range.
                numRange = String(numbers[rangeStart]) + "-" + String(numbers[rangeEnd])
                // 3 or more sequential numbers found, so next possible range must start after this one.
                nextRangeStart = rangeEnd + 1
            }
        }
        // Append the range (or single number) just found to the list of range.
        rangedReferenceDesignations.push(designator + numRange)
        // Point to the start of the next possible range and keep looking.
        rangeStart = nextRangeStart
    }
    return rangedReferenceDesignations
}

function populateBomBody()
{
    let bom = document.getElementById("bombody");

    clearBOMTable();

    globalData.setHighlightHandlers([]);
    globalData.setCurrentHighlightedRowId(null, false);

    let bomtable = pcb.GetBOM();

    if (globalData.getBomSortFunction())
    {
        bomtable = bomtable.slice().sort(globalData.getBomSortFunction());
    }

    for (let i in bomtable)
    {
        let bomentry = bomtable[i];
        let references = ConvertReferenceDesignatorsToRanges(bomentry.reference.split(',')).join(',');

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

        // References
        td = document.createElement("TD");
        td.innerHTML = references;
        tr.appendChild(td);

        // Value
        td = document.createElement("TD");
        td.innerHTML = bomentry.value;
        tr.appendChild(td);

        // Attributes
        let additionalAttributes = globalData.getAdditionalAttributes().split(",");
        for (let x of additionalAttributes)
        {
            x = x.trim()
            if (x)
            {
                td = document.createElement("TD");
                td.innerHTML =pcb.getAttributeValue(bomentry, x.toLowerCase());
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
    }
}

function createRowHighlightHandler(rowid, refs)
{
    return function(event)
    {
        /*
            If control key pressed pressed, then keep original rows highlighted and 
            highlight new selected row. 
        */
        if(event.ctrlKey)
        {
            /* Only append the new cicked object if not currently highlited */
            let alreadySelected = false;
            /* Disable highlight on all rows */
            let highlitedRows = globalData.getCurrentHighlightedRowId()
            for(let highlitedRow of highlitedRows)
            {
                // USed here so that the row if highlighted will not highlighted
                if (highlitedRow == rowid)
                {
                    alreadySelected = true;
                }
            }

            if(alreadySelected == false)
            {
                document.getElementById(rowid).classList.add("highlighted");
                globalData.setCurrentHighlightedRowId(rowid, true);
                globalData.setHighlightedRefs(refs, true);
                render.drawHighlights(IsCheckboxClicked(rowid, "placed"));
            }
        }
        else
        {
            /* Disable highlight on all rows */
            let highlitedRows = globalData.getCurrentHighlightedRowId()
            for(let highlitedRow of highlitedRows)
            {
                // USed here so that the row if highlighted will not highlighted
                if (highlitedRow == rowid)
                {
                    // Skip do nothing
                }
                else
                {
                    document.getElementById(highlitedRow).classList.remove("highlighted");
                }
            }
            // Highlight current clicked row
            document.getElementById(rowid).classList.add("highlighted");
            globalData.setCurrentHighlightedRowId(rowid, false);
            globalData.setHighlightedRefs(refs);
            render.drawHighlights(IsCheckboxClicked(rowid, "placed"));
        }
    }
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

function populateBomTable()
{
    populateBomHeader();
    populateBomBody();
}

function populateBomHeader() 
{
    let bomhead   = document.getElementById("bomhead");
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
            tr.appendChild(createColumnHeader(x2, "Checkboxes"));
        }
    }

    tr.appendChild(createColumnHeader("References", "References"));

    tr.appendChild(createColumnHeader("Value", "Value"));

    let additionalAttributes = globalData.getAdditionalAttributes().split(",");
    // Remove null, "", undefined, and 0 values
    additionalAttributes    =additionalAttributes.filter(function(e){return e});
    for (let x of additionalAttributes)
    {
        // remove beginning and trailing whitespace
        x = x.trim()
        if (x) 
        {
            tr.appendChild(createColumnHeader(x, "Attributes"));
        }
    }

    if(globalData.getCombineValues())
    {
            //XXX: This comparison function is using positive and negative implicit
            tr.appendChild(createColumnHeader("Quantity", "Quantity"));
    }

    bomhead.appendChild(tr);
}

/*
    Creates a new column header and regenerates BOM table.
    BOM table is recreated since a new column has been added.
*/
function createColumnHeader(name, cls)
{
    let th = document.createElement("TH");
    th.innerHTML = name;
    th.classList.add(cls);
    let span = document.createElement("SPAN");
    th.appendChild(span);
    return th;
}

function Filter(s)
{
    s = s.toLowerCase();
    let bomBody = document.getElementById("bombody");

    for (let part of bomBody.rows)
    {
        // This is searching for the string across the entire rows 
        // text.
        if(part.innerText.trim().toLowerCase().includes(s))
        {
            part.style.display = "";
        }
        else
        {
            part.style.display = "none";
        }
    }
}

function FilterByAttribute(s)
{
    s = s.toLowerCase();
    let bomBody = document.getElementById("bombody");

    if(s != "")
    {
        for (let part of bomBody.rows)
        {
            if(part.innerText.trim().toLowerCase().includes(s))
            {
                part.style.display = "none";
            }
            else
            {
                part.style.display = "";
            }
        }
    }
}

module.exports = {
    setBomCheckboxes, populateBomTable,
    setRemoveBOMEntries, clearBOMTable, Filter, FilterByAttribute
};
