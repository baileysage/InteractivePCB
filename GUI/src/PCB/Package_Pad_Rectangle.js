"use strict";

var Package_Pad         = require("./Package_Pad.js").Package_Pad
var Point           = require("../render/point.js").Point
var render_lowlevel = require("../render/render_lowlevel.js");

class Package_Pad_Rectangle extends Package_Pad
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
        this.dx         = iPCB_JSON_Pad.dx;
        this.dy         = iPCB_JSON_Pad.dy;
        this.drill      = iPCB_JSON_Pad.drill;
    }

    Render(guiContext, scalefactor)
    {
        guiContext.save();
        let centerPoint = new Point(this.x, this.y);

        /*
                The following derive the corner points for the
                rectangular pad. These are calculated using the center 
                point of the rectangle along with the width and height 
                of the rectangle. 
        */
        // Top left point
        let point0 = new Point(-this.dx/2, this.dy/2);
        // Top right point
        let point1 = new Point(this.dx/2, this.dy/2);
        // Bottom right point
        let point2 = new Point(this.dx/2, -this.dy/2);
        // Bottom left point
        let point3 = new Point(-this.dx/2, -this.dy/2);


        let renderOptions = {
            color: 'black',
            fill: true,
        };

        render_lowlevel.RegularPolygon( 
            guiContext,
            centerPoint, 
            [point0, point1, point2, point3],
            this.angle,
            renderOptions
        );

        if(this.pad_type == "tht")
        {
            //DrawDrillHole(guiContext, pad.x, pad.y, pad.drill/2);
        }
        guiContext.restore();
    }
}

module.exports = {
    Package_Pad_Rectangle
};
