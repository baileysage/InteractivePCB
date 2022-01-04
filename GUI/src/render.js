/* PCB rendering code */

"use strict";

var globalData         = require("./global.js");

var render_silkscreen  = require("./render/render_silkscreen.js");
var render_canvas      = require("./render/render_Canvas.js");
var render_boundingbox = require("./render/render_boundingbox.js");
var pcb                = require("./pcb.js");
var colorMap           = require("./colormap.js");


//REMOVE: Using to test alternate placed coloring
let isPlaced = false;


function DrawPad(ctx, pad, color) 
{

}

function DrawTraces(isViewFront, scalefactor)
{
    for (let trace of globalData.pcb_traces)
    {
        trace.Render(isViewFront, scalefactor);
    }
}

function DrawSilkscreen(isViewFront, scalefactor)
{
    for (let layer of globalData.layer_list)
    {
        layer[1][0].Render(isViewFront, scalefactor);
    }
}

function DrawModules(isViewFront, scalefactor)
{
    for (let part of globalData.pcb_parts)
    {
        part.Render(isViewFront, scalefactor);
    }
}

function drawCanvas(canvasdict)
{
    render_canvas.RedrawCanvas(canvasdict);
    let isViewFront = (canvasdict.layer === "F");
    DrawModules   (isViewFront, canvasdict.transform.s);
    DrawTraces    (isViewFront, canvasdict.transform.s);
    // Draw last so that text is not erased when drawing polygons.
    DrawSilkscreen(isViewFront, canvasdict.transform.s);
}

function ClearCanvas(canvasdict)
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
    DrawModules   (isViewFront, canvasdict.layer, canvasdict.transform.s, globalData.getHighlightedRefs());
}

function drawHighlights(passed) 
{
    isPlaced=passed;
    //drawHighlightsOnLayer(globalData.GetAllCanvas().front);
    //drawHighlightsOnLayer(globalData.GetAllCanvas().back);
}

function resizeAll() 
{
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().front);
    render_canvas.ResizeCanvas(globalData.GetAllCanvas().back);
    drawCanvas(globalData.GetAllCanvas().front);
    drawCanvas(globalData.GetAllCanvas().back);
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
    initRender, resizeAll, drawCanvas, drawHighlights, RotateVector, SetBoardRotation, ClearCanvas
};