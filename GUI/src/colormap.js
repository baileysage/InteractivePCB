"use strict";

var globalData        = require("./global.js");

var ColorMap = new Map(
[ 
    // Light Mode, Dark Mode
    ["Drill"                  ,["#CCCCCC"   , "#CCCCCC"]],
    ["BboundingBox_Default"   ,["#878787"   , "#878787"]],
    ["BboundingBox_Placed"    ,["#40D040"   , "#40D040"]],
    ["BboundingBox_Highlited" ,["#D04040"   , "#D04040"]],
    ["BboundingBox_Debug"     ,["#2977ff"   , "#2977ff"]],
    ["Pad_Default"            ,["#878787"   , "#878787"]],
    ["Pad_Pin1"               ,["#ffb629"   , "#ffb629"]],
    ["Pad_IsHighlited"        ,["#D04040"   , "#D04040"]],
    ["Pad_IsPlaced"           ,["#40D040"   , "#40D040"]],
    ["Default"                ,["#878787"   , "#878787"]]
]);



function SetColor(colorName, colorCode)
{
    ColorMap.set(colorName, [colorCode, colorCode]);
}

/*
    Currently 2 supported color palette. 
    Palette 0 is for light mode, and palette 1 
    id for dark mode.
*/
function GetColorPalette()
{
    return (globalData.readStorage("darkmode") === "true") ? 1 : 0;
}

function GetTraceColor(traceLayer)
{
    let traceColorMap = ColorMap.get(traceLayer)
    if (traceColorMap == undefined)
    {
        //console.log("WARNING: Invalid trace layer number, using default.");
        return ColorMap.get("Default")[GetColorPalette()];
    }
    else
    {
        return traceColorMap[GetColorPalette()];
    }
}


function GetBoundingBoxColor(isHighlited, isPlaced)
{
    // Order of color selection.
    if (isPlaced) 
    {
        let traceColorMap = ColorMap.get("BboundingBox_Placed")
        return traceColorMap[GetColorPalette()];
    }
    // Highlighted and not placed
    else if(isHighlited)
    {
        let traceColorMap = ColorMap.get("BboundingBox_Highlited")
        return traceColorMap[GetColorPalette()];
    }
    /* 
        If debug mode is enabled then force drawing a bounding box
      not highlighted,  not placed, and debug mode active
    */
    else if(globalData.getDebugMode())
    {
        let traceColorMap = ColorMap.get("BboundingBox_Debug")
        return traceColorMap[GetColorPalette()];
    }
    else
    {
        let traceColorMap = ColorMap.get("BboundingBox_Default")
        return traceColorMap[GetColorPalette()];
    }
}


function GetPadColor(isPin1, isHighlited, isPlaced)
{
    if(isPin1)
    {
        let traceColorMap = ColorMap.get("Pad_Pin1");
        return traceColorMap[GetColorPalette()];
    }
    else if(isPlaced && isHighlited)
    {
        let traceColorMap = ColorMap.get("Pad_IsPlaced");
        return traceColorMap[GetColorPalette()];
    }
    else if(isHighlited)
    {
        let traceColorMap = ColorMap.get("Pad_IsHighlited");
        return traceColorMap[GetColorPalette()];
    }
    else
    {
        let traceColorMap = ColorMap.get("Pad_Default");
        return traceColorMap[GetColorPalette()];
    }
}

function GetViaColor()
{
    let traceColorMap = ColorMap.get("Vias");
    if (traceColorMap == undefined)
    {
        //console.log("WARNING: Invalid trace layer number, using default.");
       return ColorMap.get("Default")[GetColorPalette()];
    }
    else
    {
        return traceColorMap[GetColorPalette()];
    }
}

function GetDrillColor()
{
    let traceColorMap = ColorMap.get("Drill");
    if (traceColorMap == undefined)
    {
        //console.log("WARNING: Invalid trace layer number, using default.");
        return ColorMap.get("Default")[GetColorPalette()];
    }
    else
    {
        return traceColorMap[GetColorPalette()];
    }
}

module.exports = {
    GetTraceColor, GetBoundingBoxColor, GetPadColor,
    GetViaColor, GetDrillColor, SetColor
};
