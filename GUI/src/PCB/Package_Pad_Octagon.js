"use strict";

var Package_Pad     = require("./Package_Pad.js").Package_Pad
var Point           = require("../render/point.js").Point
var render_lowlevel = require("../render/render_lowlevel.js");
var pcb             = require("../pcb.js");
var colormap        = require("../colormap.js");

class Package_Pad_Octagon extends Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        super(iPCB_JSON_Pad);
        this.pad_type   = iPCB_JSON_Pad.pad_type;
        this.pin1       = iPCB_JSON_Pad.pin1;
        this.shape      = iPCB_JSON_Pad.shape;
        this.angle      = iPCB_JSON_Pad.angle;
        this.x          = iPCB_JSON_Pad.x;
        this.y          = iPCB_JSON_Pad.y;
        this.diameter   = iPCB_JSON_Pad.diameter;
        this.drill      = iPCB_JSON_Pad.drill;
    }

    Render(isFront, location, scalefactor)
    {
        // TODO: Global function here. GUI context should be passed as 
        //       an argument to the function. 
        let guiContext = pcb.GetLayerCanvas("Pads", isFront).getContext("2d")


        if(    (((location == "F") && (this.pad_type == "smd") &&  isFront))
            || (((location == "B") && (this.pad_type == "smd") && !isFront))
            || (this.pad_type == "tht")
          )
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
            let color = colormap.GetPadColor(this.pin1, false, false);
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
}

module.exports = {
    Package_Pad_Octagon
};
