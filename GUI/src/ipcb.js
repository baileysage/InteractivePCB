/* DOM manipulation and misc code */

"use strict";


var Split             = require("split.js");
var globalData        = require("./global.js");
var render            = require("./render.js");
var renderCanvas      = require("./render/render_Canvas.js");
var pcb               = require("./pcb.js");
var handlers_mouse    = require("./handlers_mouse.js");
var layerTable        = require("./layer_table.js");
var bomTable          = require("./bom_table.js");
var Metadata          = require("./Metadata.js").Metadata;

var PCB_Trace = require("./PCB/PCB_Trace.js").PCB_Trace;
var PCB_Layer = require("./PCB/PCB_Layer.js").PCB_Layer;
var PCB_Part  = require("./PCB/PCB_Part.js").PCB_Part;

var Render_Layer = require("./render/Render_Layer.js").Render_Layer;
var version           = require("./version.js");

var Fullscreen = require("./fullscreen.js");
var colorMap        = require("./colormap.js");

function setDarkMode(value)
{
    let topmostdiv = document.getElementById("topmostdiv");
    if (value)
    {
        topmostdiv.classList.add("dark");
    }
    else
    {
        topmostdiv.classList.remove("dark");
    }
    globalData.writeStorage("darkmode", value);

    render.RenderPCB(globalData.GetAllCanvas().front);
    render.RenderPCB(globalData.GetAllCanvas().back);
}

function highlightPreviousRow(event)
{
    if (globalData.getCurrentHighlightedRowId().length == 1)
    {
        for (let i = 0; i < globalData.getHighlightHandlers().length - 1; i++)
        {
            if (globalData.getHighlightHandlers()[i + 1].id == globalData.getCurrentHighlightedRowId())
            {
                globalData.getHighlightHandlers()[i].handler(event);
                break;
            }
        }
        handlers_mouse.smoothScrollToRow(globalData.getCurrentHighlightedRowId());
    }
}

function highlightNextRow(event)
{
    if (globalData.getCurrentHighlightedRowId().length == 1)
    {
        for (let i = 1; i < globalData.getHighlightHandlers().length; i++)
        {
            if (globalData.getHighlightHandlers()[i - 1].id == globalData.getCurrentHighlightedRowId())
            {
                globalData.getHighlightHandlers()[i].handler(event);
                break;
            }
        }
        handlers_mouse.smoothScrollToRow(globalData.getCurrentHighlightedRowId());
    }
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
            handlers_mouse.smoothScrollToRow(globalData.getCurrentHighlightedRowId());
            break;
        }
    }
}

function changeCanvasLayout(layout) 
{
    if(mainLayout != "BOM")
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
    }
}

function populateMetadata()
{
    let metadata = Metadata.GetInstance();
    metadata.Set(pcbdata.metadata);

    if(metadata.revision == undefined)
    {
        document.getElementById("revision").innerHTML = "";
    }
    else
    {
        document.getElementById("revision").innerHTML = "Revision: " + metadata.revision.toString();
    }

    if(metadata.company == undefined)
    {
        document.getElementById("company").innerHTML = "";
    }
    else
    {
        document.getElementById("company").innerHTML  = metadata.company;
    }

    if(metadata.project_name == undefined)
    {
        document.getElementById("title").innerHTML = "";
    }
    else
    {
        document.getElementById("title").innerHTML = metadata.project_name;
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

function setAdditionalAttributes(value)
{
    globalData.setAdditionalAttributes(value);
    globalData.writeStorage("additionalAttributes", value);
    bomTable.populateBomTable();
}

// XXX: None of this seems to be working. 
document.onkeydown = function(e)
{
    switch (e.key)
    {
        case "ArrowUp":
            highlightPreviousRow(e);
            e.preventDefault();
            break;
        case "ArrowDown":
            highlightNextRow(e);
            e.preventDefault();
            break;
        case "F11":
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

/* Layer table */
let layerTableVisable     = true;
let traceTableVisable     = false;
let testPointTableVisable = false;
let mainLayout = "";

document.getElementById("lay-btn").classList.add("depressed");
function LayerTable_Toggle()
{
    if (layerTableVisable)
    {
        layerTableVisable = false;
        document.getElementById("lay-btn").classList.remove("depressed");
    }
    else
    {
        layerTableVisable = true;
        document.getElementById("lay-btn").classList.add("depressed");
    }
    changeBomLayout(mainLayout);
}

function LayerTable_Off()
{
    layerTableVisable = false;
    document.getElementById("lay-btn").classList.remove("depressed");
    changeBomLayout(mainLayout);
}

function LayerTable_On()
{
    layerTableVisable = true;
    document.getElementById("lay-btn").classList.add("depressed");
    changeBomLayout(mainLayout);
}

document.getElementById("trace-btn").classList.remove("depressed");
function TraceTable_Toggle()
{
    if (traceTableVisable)
    {
        traceTableVisable = false;
        document.getElementById("trace-btn").classList.remove("depressed");
    }
    else
    {
        traceTableVisable = true;
        document.getElementById("trace-btn").classList.add("depressed");
    }
    changeBomLayout(mainLayout);
}

function TraceTable_Off()
{
    traceTableVisable = false;
    document.getElementById("trace-btn").classList.remove("depressed");
    changeBomLayout(mainLayout);
}

function TraceTable_On()
{
    traceTableVisable = true;
    document.getElementById("trace-btn").classList.add("depressed");
    changeBomLayout(mainLayout);
}

document.getElementById("testpoint-btn").classList.remove("depressed");
function TestPointTable_Toggle()
{
    if (testPointTableVisable)
    {
        testPointTableVisable = false;
        document.getElementById("testpoint-btn").classList.remove("depressed");
    }
    else
    {
        testPointTableVisable = true;
        document.getElementById("testpoint-btn").classList.add("depressed");
    }
    changeBomLayout(mainLayout);
}

function TestPointTable_Off()
{
    testPointTableVisable = false;
    document.getElementById("testpoint-btn").classList.remove("depressed");
    changeBomLayout(mainLayout);
}

function TestPointTable_On()
{
    testPointTableVisable = true;
    document.getElementById("testpoint-btn").classList.add("depressed");
    changeBomLayout(mainLayout);
}

function Create_Layers(pcbdata)
{
    globalData.layer_list = new Map();
    /* Create layer objects from JSON file */
    for(let layer of pcbdata.board.layers)
    {
        globalData.layer_list.set(layer.name, [new PCB_Layer(layer), new Render_Layer(layer)]);
    }

    /*
        Internally the following layers are used
            1. Pads
            2. Highlights
        If these were not created before, then they will be created here.
    */
    let layerPads       = {"name":"Pads", "paths": []};
    if(globalData.layer_list.get(layerPads.name) == undefined)
    {
        globalData.layer_list.set(layerPads.name, [new PCB_Layer(layerPads), new Render_Layer(layerPads)]);
    }

    let layerHighlights = {"name":"Highlights", "paths": []};
    if(globalData.layer_list.get(layerHighlights.name) == undefined)
    {
        globalData.layer_list.set(layerHighlights.name, [new PCB_Layer(layerHighlights), new Render_Layer(layerHighlights)]);
    }
}

function Create_Traces(pcbdata)
{
    globalData.pcb_traces = [];
    /* Create trace objects from JSON file */
    for(let trace of pcbdata.board.traces)
    {
        globalData.pcb_traces.push(new PCB_Trace(trace));
    }
}

function Create_Parts(pcbdata)
{
    globalData.pcb_parts = [];
    /* Create layer objects from JSON file */
    for(let part of pcbdata.parts)
    {
        globalData.pcb_parts.push(new PCB_Part(part));
    }
}

function Create_Configuration(pcbdata)
{
    for(let config of pcbdata.configuration)
    {
        if(config.category=="color")
        {
            colorMap.SetColor(config.name, config.value);
        }
        else
        {
            console.log("Warning: Unsupported parameter ", config.category, config.name);
        }
    }
}

function LoadPCB(pcbdata)
{
    // Update COnfiguration data
    Create_Configuration(pcbdata);

    // Remove all items from BOM table
    // And delete internal bom structure
    bomTable.clearBOMTable();
    pcb.DeleteBOM();
    // Create a new BOM table
    pcb.CreateBOM(pcbdata);

    for (let layer of globalData.layer_list)
    {
        renderCanvas.ClearCanvas(layer[1][globalData.render_layers].GetCanvas(true));
        renderCanvas.ClearCanvas(layer[1][globalData.render_layers].GetCanvas(false));
    }
    
    layerTable.clearLayerTable(); // <--- Actually viewed layer table
    Create_Layers(pcbdata); // <--- BAckground layer information
    layerTable.populateLayerTable();

    // Update Metadata
    let metadata = Metadata.GetInstance();
    metadata.Set(pcbdata.metadata);
    populateMetadata();

    // Create traces
    Create_Traces(pcbdata);

    // Parts
    Create_Parts(pcbdata);


}

function changeBomLayout(layout)
{
    mainLayout = layout;
    document.getElementById("bom-btn").classList.remove("depressed");
    document.getElementById("bom-lr-btn").classList.remove("depressed");
    document.getElementById("bom-tb-btn").classList.remove("depressed");
    document.getElementById("pcb-btn").classList.remove("depressed");
    switch (layout)
    {
    case "BOM":
        document.getElementById("bom-btn").classList.add("depressed");

        document.getElementById("fl-btn").classList.remove("depressed");
        document.getElementById("fb-btn").classList.remove("depressed");
        document.getElementById("bl-btn").classList.remove("depressed");

        if (globalData.getBomSplit()) 
        {
            if(layerTableVisable)
            {
                globalData.destroyLayerSplit();
                globalData.setLayerSplit(null);
            }
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        document.getElementById("bomdiv").style.display = "";
        document.getElementById("frontcanvas").style.display = "none";
        document.getElementById("backcanvas").style.display = "none";
        if(layerTableVisable)
        {
            layerTableVisable = false;
            document.getElementById("lay-btn").classList.remove("depressed");
            document.getElementById("layerdiv").style.display = "none";
        }

        document.getElementById("bot").style.height = "";

        document.getElementById("datadiv"   ).classList.add(   "split-horizontal");
        break;
    case "PCB":
    
        document.getElementById("pcb-btn"     ).classList.add("depressed");
        document.getElementById("bomdiv").style.display = "none";
        document.getElementById("frontcanvas").style.display = "";
        document.getElementById("backcanvas" ).style.display = "";
        
        if(layerTableVisable)
        {
            document.getElementById("layerdiv"   ).style.display = "";
        }
        else
        {
            document.getElementById("layerdiv"   ).style.display = "none";
        }

        document.getElementById("bot"        ).style.height = "calc(90%)";
        
        document.getElementById("datadiv"   ).classList.add(   "split-horizontal");
        document.getElementById("bomdiv"     ).classList.remove(   "split-horizontal");
        document.getElementById("canvasdiv"  ).classList.remove(   "split-horizontal");
        document.getElementById("frontcanvas").classList.add(   "split-horizontal");
        document.getElementById("backcanvas" ).classList.add(   "split-horizontal");
        if(layerTableVisable)
        {
            document.getElementById("layerdiv"   ).classList.add(   "split-horizontal");
        }

        if (globalData.getBomSplit())
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        if(layerTableVisable)
        {
            globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
                sizes: [80, 20],
                onDragEnd: render.resizeAll,
                gutterSize: 5,
                cursor: "col-resize"
            }));
        }
        else
        {
            globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
                sizes: [99, 0.1],
                onDragEnd: render.resizeAll,
                gutterSize: 5,
                cursor: "col-resize"
            }));
        }

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

        document.getElementById("canvasdiv"  ).style.height = "calc(99%)";
        
        break;
    case "TB":
        document.getElementById("bom-tb-btn"     ).classList.add("depressed");
        document.getElementById("bomdiv").style.display = "";
        document.getElementById("frontcanvas").style.display = "";
        document.getElementById("backcanvas" ).style.display = "";
        if(layerTableVisable)
        {
            document.getElementById("layerdiv"   ).style.display = "";
        }
        else
        {
            document.getElementById("layerdiv"   ).style.display = "none";
        }
        document.getElementById("bot"        ).style.height = "calc(90%)";

        document.getElementById("datadiv"   ).classList.add(   "split-horizontal");
        document.getElementById("bomdiv"     ).classList.remove(   "split-horizontal");
        document.getElementById("canvasdiv"  ).classList.remove(   "split-horizontal");
        document.getElementById("frontcanvas").classList.add(   "split-horizontal");
        document.getElementById("backcanvas" ).classList.add(   "split-horizontal");
        if(layerTableVisable)
        {
            document.getElementById("layerdiv"   ).classList.add(   "split-horizontal");
        }

        if (globalData.getBomSplit())
        {
            globalData.destroyLayerSplit();
            globalData.setLayerSplit(null);
            globalData.destroyBomSplit();
            globalData.setBomSplit(null);
            globalData.destroyCanvasSplit();
            globalData.setCanvasSplit(null);
        }

        if(layerTableVisable)
        {
            globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
                sizes: [80, 20],
                onDragEnd: render.resizeAll,
                gutterSize: 5,
                cursor: "col-resize"
            }));
        }
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
        if(layerTableVisable)
        {
            document.getElementById("layerdiv"   ).style.display = "";
        }
        else
        {
            document.getElementById("layerdiv"   ).style.display = "none";
        }
        document.getElementById("bot"        ).style.height = "calc(90%)";

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

        if(layerTableVisable)
        {
            globalData.setLayerSplit(Split(["#datadiv", "#layerdiv"], {
                sizes: [80, 20],
                onDragEnd: render.resizeAll,
                gutterSize: 5,
                cursor: "col-resize"
            }));
        }

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
    bomTable.populateBomTable();
    changeCanvasLayout(globalData.getCanvasLayout());
}

// TODO: Remove global variable. Used to test feature.
document.getElementById("fullscreen-btn").classList.remove("depressed");
let isFullscreen = false;
function toggleFullScreen()
{
    if(isFullscreen)
    {
        document.getElementById("fullscreen-btn").classList.remove("depressed");
        isFullscreen = false;
        Fullscreen.closeFullscreen();
    }
    else
    {
        document.getElementById("fullscreen-btn").classList.add("depressed");
        isFullscreen = true;
        Fullscreen.openFullscreen();
    }
}

//XXX: I would like this to be in the html functions js file. But this function needs to be 
//     placed here, otherwise the application rendering becomes very very weird.
window.onload = function(e)
{
    console.time("on load");

    // Must occure early for storage parameters to be loaded. If not loaded early then 
    // incorrect parameters may be used.
    globalData.initStorage();

    pcb.CreateBOM(pcbdata);
    let metadata = Metadata.GetInstance();
    metadata.Set(pcbdata.metadata);

    let versionNumberHTML       = document.getElementById("softwareVersion");
    versionNumberHTML.innerHTML = version.GetVersionString();
    console.log(version.GetVersionString());




    Create_Traces(pcbdata);
    Create_Layers(pcbdata);
    Create_Parts(pcbdata);
    Create_Configuration(pcbdata);

    layerTable.populateLayerTable();

    // Must be called after loading PCB as rendering required the bounding box information for PCB
    render.initRender();


    //cleanGutters();

    populateMetadata();

    // Create canvas layers. One canvas per pcb layer



    // Set up mouse event handlers
    handlers_mouse.addMouseHandlers(document.getElementById("frontcanvas"), globalData.GetAllCanvas().front);
    handlers_mouse.addMouseHandlers(document.getElementById("backcanvas") , globalData.GetAllCanvas().back);

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

    globalData.setBomCheckboxes(globalData.readStorage("bomCheckboxes"));
    if (globalData.getBomCheckboxes() === null)
    {
        globalData.setBomCheckboxes("");
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
        render.RenderPCB(globalData.GetAllCanvas().front);
        render.RenderPCB(globalData.GetAllCanvas().back);
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
    changeBomLayout        , setDarkMode     , changeCanvasLayout,
    setAdditionalAttributes, LayerTable_Toggle, TraceTable_Toggle,
    TestPointTable_Toggle  , toggleFullScreen , LoadPCB, LayerTable_Off,
    LayerTable_On          , TraceTable_Off   , TraceTable_On,
    TestPointTable_Off     , TestPointTable_On
};
