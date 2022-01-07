"use strict";


var Point          = require("./render/point.js").Point
var render_lowlevel = require("./render/render_lowlevel.js");

class BoundingBox
{
    constructor(x0, y0, x1, y1)
    {
        /*
                The following derive the corner points for the
                rectangular pad. These are calculated using the center 
                point of the rectangle along with the width and height 
                of the rectangle. 
        */
        // Top left point
        this.point0 = new Point(x0,y0);
        // Top right point
        this.point1 = new Point(x1,y0);
        // Bottom right point
        this.point2 = new Point(x1,y1);
        // Bottom left point
        this.point3 = new Point(x0,y1);

    }

    Render(guiContext, color)
    {
        let centerPoint = new Point(0, 0);

        // First fill the box. 
        let renderOptions = {
            color: color,
            fill: true,
            globalAlpha: 0.2
        };

        render_lowlevel.RegularPolygon( 
            guiContext,
            centerPoint, 
            [this.point0, this.point1, this.point2, this.point3],
            0,
            renderOptions
        );

        // Now stoke the box
        renderOptions = {
            color: color,
            fill: false,
            globalAlpha: 1, 
            lineWidth: 0.33
        };

        render_lowlevel.RegularPolygon( 
            guiContext,
            centerPoint, 
            [this.point0, this.point1, this.point2, this.point3],
            0,
            renderOptions
        );
    }

}

module.exports = {
    BoundingBox
};
