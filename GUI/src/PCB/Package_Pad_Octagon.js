"use strict";

var Package_Pad     = require("./Package_Pad.js").Package_Pad
var Point           = require("../render/point.js").Point
var render_lowlevel = require("../render/render_lowlevel.js");
var colormap        = require("../colormap.js");

class Package_Pad_Octagon extends Package_Pad
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
        // Will store the verticies of the polygon.
        let polygonVerticies = [];

        
        let n = 8;
        let r = this.diameter/2;
        // Assumes a polygon centered at (0,0)
        for (let i = 1; i <= n; i++) 
        {
            polygonVerticies.push(new Point(r * Math.cos(2 * Math.PI * i / n), r * Math.sin(2 * Math.PI * i / n)));
        }

        let angle = (this.angle+45/2);
        let centerPoint = new Point(this.x, this.y);
        let renderOptions = { 
            color: color,
            fill: true,
        };

        render_lowlevel.RegularPolygon( 
            guiContext,
            centerPoint, 
            polygonVerticies,
            angle,
            renderOptions
        );


        if(this.pad_type == "tht")
        {
            let centerPoint = new Point(this.x, this.y);
            let renderOptions = {
                color: "#CCCCCC",
                fill: true,
            };

            render_lowlevel.Circle(
                guiContext,
                centerPoint,
                this.drill/2, 
                renderOptions
            );
        }

        guiContext.restore();
    }
}

module.exports = {
    Package_Pad_Octagon
};
