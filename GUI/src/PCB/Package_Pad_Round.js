"use strict";

var Package_Pad     = require("./Package_Pad.js").Package_Pad
var Point           = require("../render/point.js").Point
var render_lowlevel = require("../render/render_lowlevel.js");
var colormap        = require("../colormap.js");

class Package_Pad_Round extends Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        super(iPCB_JSON_Pad);
        this.angle      = iPCB_JSON_Pad.angle;
        this.x          = iPCB_JSON_Pad.x;
        this.y          = iPCB_JSON_Pad.y;
        this.diameter   = iPCB_JSON_Pad.diameter;
        this.drill      = iPCB_JSON_Pad.drill;
    }

    Render(guiContext, color)
    {
        guiContext.save();

        let centerPoint = new Point(this.x, this.y);
        let renderOptions = {
            color: color,
            fill: true,
        };

        render_lowlevel.Circle( 
            guiContext,
            centerPoint,                         
            this.drill, 
            renderOptions
        ); 

        renderOptions = {
            color: "#CCCCCC",
            fill: true,
        };

        render_lowlevel.Circle(
            guiContext,
            centerPoint,
            this.drill/2, 
            renderOptions
        );

        guiContext.restore();

    }
}

module.exports = {
    Package_Pad_Round
};
