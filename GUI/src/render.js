/* PCB rendering code */

"use strict";

var globalData         = require("./global.js");
var render_canvas      = require("./render/render_Canvas.js");
var pcb                = require("./pcb.js");

function DrawTraces(isViewFront, scalefactor)
{
    for (let trace of globalData.pcb_traces)
    {
        trace.Render(isViewFront, scalefactor);
    }
}

function DrawLayers(isViewFront, scalefactor)
{
    for (let layer of globalData.layer_list)
    {
        layer[1][0].Render(isViewFront, scalefactor);
    }
}

function DrawModules(isViewFront)
{
    // TODO: Global function here. GUI context should be passed as 
    //       an argument to the function. 
    let guiContext = pcb.GetLayerCanvas("Pads", isViewFront).getContext("2d")
    for (let part of globalData.pcb_parts)
    {
        part.Render(guiContext, isViewFront, false);
    }
}

function DrawHighlitedModules(isViewFront, layer, scalefactor, refs)
{
    // TODO: Global function here. GUI context should be passed as 
    //       an argument to the function. 
    let guiContext = pcb.GetLayerCanvas("Highlights", isViewFront).getContext("2d")
    // Draw selected parts on highlight layer.
    for (let part of globalData.pcb_parts)
    {
        if(refs.includes(part.name))
        {
            part.Render(guiContext, isViewFront, true);
        }
    }
}

function RenderPCB(canvasdict)
{
    render_canvas.RedrawCanvas(canvasdict);
    let isViewFront = (canvasdict.layer === "F");
    
    /* 
        Renders entire PCB for specified view
        Rendering occurs in three steps
            1. Modules
            2. Traces
            3. Layers

        Step 3 essentially renders items on layers not rendered in 1 or 2. 
        This could be silkscreen, cutouts, board edge, etc...
    */
    DrawModules(isViewFront);
    DrawTraces (isViewFront, canvasdict.transform.s);
    DrawLayers (isViewFront, canvasdict.transform.s);
}

function ClearCanvas()
{
    initRender();
}

function RotateVector(v, angle)
{
    return render_canvas.rotateVector(v, angle);
}

function initRender()
{
    let allcanvas = {
        front: {
            transform: {
                x: 0,
                y: 0,
                s: 1,
                panx: 0,
                pany: 0,
                zoom: 1,
                mousestartx: 0,
                mousestarty: 0,
                mousedown: false,
            },
            layer: "F",
        },
        back: {
            transform: {
                x: 0,
                y: 0,
                s: 1,
                panx: 0,
                pany: 0,
                zoom: 1,
                mousestartx: 0,
                mousestarty: 0,
                mousedown: false,
            },
            layer: "B",
        }
    };
    // Sets the data strucure to a default value. 
    globalData.SetAllCanvas(allcanvas);
    // Set the scale so the PCB will be scaled and centered correctly.
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().front);
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().back);
}

function drawHighlightsOnLayer(canvasdict) 
{
    let isViewFront = (canvasdict.layer === "F");
    render_canvas.ClearHighlights(canvasdict);

    DrawHighlitedModules(isViewFront, canvasdict.layer, canvasdict.transform.s, globalData.getHighlightedRefs());
}

function drawHighlights() 
{
    drawHighlightsOnLayer(globalData.GetAllCanvas().front);
    drawHighlightsOnLayer(globalData.GetAllCanvas().back);
}

function resizeAll() 
{
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().front);
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().back);
    RenderPCB(globalData.GetAllCanvas().front);
    RenderPCB(globalData.GetAllCanvas().back);
}

function SetBoardRotation(value) 
{
    /*
        The board when drawn by default is show rotated -180 degrees. 
        The following will add 180 degrees to what the user calculates so that the PCB
        will be drawn in the correct orientation, i.e. displayed as shown in ECAD program. 
        Internally the range of degrees is stored as 0 -> 360
    */
    globalData.SetBoardRotation((value * 5)+180);
    globalData.writeStorage("boardRotation", globalData.GetBoardRotation());
    /*
        Display the correct range of degrees which is -180 -> 180. 
        The following just remaps 360 degrees to be in the range -180 -> 180.
    */
    document.getElementById("rotationDegree").textContent = (globalData.GetBoardRotation()-180);
    resizeAll();
}

module.exports = {
    initRender, resizeAll, RenderPCB, drawHighlights, RotateVector, SetBoardRotation, ClearCanvas
};