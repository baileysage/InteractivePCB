"use strict";

var Package_Pad     = require("./Package_Pad.js").Package_Pad
var Point           = require("../render/point.js").Point
var render_lowlevel = require("../render/render_lowlevel.js");

class Package_Pad_Offset extends Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        super(iPCB_JSON_Pad);
        this.angle      = iPCB_JSON_Pad.angle;
        this.x          = iPCB_JSON_Pad.x;
        this.y          = iPCB_JSON_Pad.y;
        this.diameter   = iPCB_JSON_Pad.diameter;
        this.elongation = iPCB_JSON_Pad.elongation;
        this.drill      = iPCB_JSON_Pad.drill;
    }

    Render(guiContext, color)
    {
        guiContext.save();
        console.log("Offset pad rending unimplemented.");
        guiContext.restore();
    }
}

module.exports = {
    Package_Pad_Offset
};
