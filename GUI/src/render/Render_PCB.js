"use strict";

var globalData = require("../global.js");
var render     = require("../render.js");

function Render_PCB()
{
    render.drawCanvas(globalData.GetAllCanvas().front);
    render.drawCanvas(globalData.GetAllCanvas().back);
}